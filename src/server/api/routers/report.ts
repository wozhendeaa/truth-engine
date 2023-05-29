import { TRPCError } from "@trpc/server";
import {  z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { inputStyles } from "theme/components/input";

const ratelimitPost = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */ 
    prefix: "@upstash/ratelimit",
  });

  
export const reportRouter = createTRPCRouter({

  getReportsForPost: publicProcedure.input(z.object({postId: z.string(),
  limit: z.number().default(50),
}))
  .query(async ({ctx, input}) => {
   let reports = await ctx.prisma.report.findMany({
        where:{
            postId: input.postId,
            post: {
              MarkAsDelete: false
            }
        },
        take: input.limit,
        include: {
          reporter: {
            select : {
              id: true,
              username: true,
              profileImageUrl:true,
              premiumStatus:true,
              role:true,
              displayname:true,
            },          
          },
        },
        orderBy: 
        {
          createdAt: "desc"
        }
      
    })
    if (!reports) reports = [];
    
    return {
      props: {
        reports: reports,
      }
    };
  }
),

getReportsForComment: publicProcedure.input(z.object({commentId: z.string(),
}))
  .query(async ({ctx, input}) => {
    let reports = await ctx.prisma.report.findMany({
      where:{
          postId: input.commentId,
          post: {
            MarkAsDelete: false
          }
      },
      include: {
        reporter: {
          select : {
            id: true,
            username: true,
            profileImageUrl:true,
            premiumStatus:true,
            role:true,
            displayname:true,
          },          
        },
      },
      orderBy: 
      {
        createdAt: "desc"
      }
    
  })
  if (!reports) reports = [];
  
  return {
    props: {
      reports: reports,
    }
  };
}
),

 reportPost: privateProcedure.input(z.object({
  postId: z.string(), 
  type: z.string(),
  content: z.string().max(255).nullable()
}))
    .mutation(async ({ctx, input}) => {
     
    const userId = ctx.curretnUserId;
    const {success} = await ratelimitPost.limit(userId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too_many_requests"})
    
    const existingReport = await ctx.prisma.report.findUnique({
      where: {
        reporterId_postId: {
          reporterId: userId,
          postId: input.postId
        }
      }
    });
  
    if (existingReport) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'already_reported' });
    }
    
    await ctx.prisma.post.update({
      where:{
        id: input.postId
      },
      data:{
        reportCount:{
          increment: 1
        }
      }
    });

    const newReport = await ctx.prisma.report.create({
      data: {
        postId: input.postId,
        content: input.content,
        reporterId: userId,
    
      },
    });    
  }
  ),

  
 reportComment: privateProcedure.input(z.object({
  commentId: z.string(), 
  type: z.string(),
  content: z.string().max(255).nullable()
}))
    .mutation(async ({ctx, input}) => {
    const userId = ctx.curretnUserId;
    const {success} = await ratelimitPost.limit(userId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too_many_requests"})
  
    const existingReport = await ctx.prisma.report.findUnique({
      where: {
        reporterId_commentId: {
          reporterId: userId,
          commentId: input.commentId
        }
      }
    });
  
    if (existingReport) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'already_reported' });
    }
        
    await ctx.prisma.comment.update({
      where:{
        id: input.commentId
      },
      data:{
        reportCount:{
          increment: 1
        }
      }
    });

    const newReport = await ctx.prisma.report.create({
      data: {
        commentId: input.commentId,
        content: input.content,
        reporterId: userId,
        reportType: input.type
      },
    });    
  }
  ),


});
