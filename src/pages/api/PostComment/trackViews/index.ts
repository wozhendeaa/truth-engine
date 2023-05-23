// pages/prepare-new-user.tsx
import { api } from 'utils/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { apiRouter, appRouter } from 'server/api/root';
import { createTRPCContext, } from 'server/api/trpc';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { TRPCError } from '@trpc/server';

export default async function handler(req:  NextApiRequest, res: NextApiResponse) {
    const context = await createTRPCContext({
            req,
            res,
        });
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