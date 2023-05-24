// pages/prepare-new-user.tsx
import { api } from 'utils/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { apiRouter, appRouter } from 'server/api/root';
import { createTRPCContext, } from 'server/api/trpc';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import requestIp from 'request-ip'

const ratelimitViewTracking = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(14, "60 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */ 
    prefix: "@upstash/ratelimit",
  });


export default async function handler(req:  NextApiRequest, res: NextApiResponse) {
    const context = await createTRPCContext({
            req,
            res,
        });
   const detectedIp = requestIp.getClientIp(req)
   if (detectedIp) {
       const {success} = await ratelimitViewTracking.limit(detectedIp);
       if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too many requests"})
   }

   const {viewedPostIds} = JSON.parse(req.body.data);          
   if (!viewedPostIds) return res.status(400).json({ message: '收到无效的消息id'});
   const caller = appRouter.createCaller(context);

   try {
        void await caller.posts.addTrackedViews({ids: viewedPostIds})
        res.status(200).json({});
   } catch (cause) {
    if (cause instanceof TRPCError) {
        // An error from tRPC occured
        const httpCode = getHTTPStatusCodeFromError(cause);
        return res.status(httpCode).json(cause);
      }
      // Another error occured
      console.error(cause);
      res.status(500).json({ message: 'server_error'});
   }

}