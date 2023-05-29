// pages/prepare-new-user.tsx
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
   const { commentId } = req.query;      
   if (!commentId) return res.status(500).json({ message: '获取评论回复时没有给评论id'});
   const caller = appRouter.createCaller(context);
   try {
        const comments = await caller.comment.getUserNewCommentForComment({commentId: commentId.toString()});
        res.status(200).json(comments);
   } catch (cause) {
    if (cause instanceof TRPCError) {
        const httpCode = getHTTPStatusCodeFromError(cause);
        return res.status(httpCode).json(cause);
      }
      // Another error occured
      console.error(cause);
      res.status(500).json({ message: 'server_error'});
   }

}