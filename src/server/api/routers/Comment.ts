import { TRPCError } from "@trpc/server";
import {  z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { postSchema } from "components/posting/PostBox";
import { RouterOutputs } from "utils/api";
import { createTRPCContext } from '../trpc';
import type Prisma  from "@prisma/client";
import { Reaction, ReactionType } from "@prisma/client";



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

  
export const commentRouter = createTRPCRouter({
  getCommentsForPost: publicProcedure.input(z.object({postId: z.string(),
  limit: z.number().default(50),}))
  .query(async ({ctx, input}) => {
   let comments = await ctx.prisma.comment.findMany({
        where:{
          replyToPostId: input.postId
        },
        take: input.limit,
        include: {
          author: {
            select : {
              id: true,
              username: true,
              profileImageUrl:true,
              premiumStatus:true,
              role:true,
              displayname:true,
            },
          }
        },
        orderBy: [{
          likes:'desc'
        },
        {
          createdAt: "desc"
        }
      ]

    })

    let reactions:Reaction[] = [];
    if (ctx.userId) {
      reactions = await ctx.prisma.reaction.findMany({
        where:{
          userId: ctx.userId,
          OR: [
            {
              postId: {
                in: comments.map(cmt => cmt.replyToPostId ?? "")
              }
            },
            {
              commentID :{
                in: comments.map(cmt => cmt.id ?? "")
              }
            }
          ]
        }
      })
    }
    if (!comments) comments = [];
    
    return {
      props: {
        comments: comments,
        reactions: reactions
      }
    };
  }
),

getCommentsForComment: publicProcedure.input(z.object({commentId: z.string(),
  limit: z.number().default(50),}))
  .query(async ({ctx, input}) => {
   let comments = await ctx.prisma.comment.findMany({
        where:{
          replyToCommentId: input.commentId
        },
        take: input.limit,
        include: {
          author: {
            select : {
              id: true,
              username: true,
              profileImageUrl:true,
              premiumStatus:true,
              role:true,
              displayname:true,
            },
          }
        },
        orderBy: [{
          likes:'desc'
        },
        {
          createdAt: "desc"
        }
      ]

    })

    let reactions:Reaction[] = [];
    if (ctx.userId) {
      reactions = await ctx.prisma.reaction.findMany({
        where:{
          userId: ctx.userId,
          commentID :{
            in: comments.map(cmt => cmt.id ?? "")
          }
        }
      })
    }
    if (!comments) comments = [];
    
    return {
      props: {
        comments: comments,
        reactions: reactions
      }
    };
  }
),


 likeComment: privateProcedure.input(z.object({commentId: z.string()}))
    .mutation(async ({ctx, input}) => {
     
    const userId = ctx.curretnUserId;
    const {success} = await ratelimitPost.limit(userId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too many requests"})
  
    const comment = await ctx.prisma.comment.findUnique({
          where:{
              id: input.commentId
          },   
          
          include: {
            reactions: {
              where :{
                 userId: userId,
                 commentID: input.commentId
              }
            }
          }
      })

      if (!comment) throw new TRPCError({code: "NOT_FOUND", 
      message: "点赞时没有找到要点赞的评论id"});

      if (comment.reactions?.length > 0) {
        const deleteUser = await ctx.prisma.reaction.delete({
          where: {
            id: comment.reactions[0]?.id,
          },
        })

        const updatedComment = await ctx.prisma.comment.update({
          where: {
            id: input.commentId,
          },
          data: {
            likes: {
              decrement: 1,
            },            
          },
        });
        
      } else {
        const newReaction = await ctx.prisma.reaction.create({
          data: {
            type: ReactionType.LIKE,
            userId: userId,
            commentID: input.commentId,
          },
        });

        const updatedComment = await ctx.prisma.comment.update({
          where: {
            id: input.commentId,
          },
          data: {
            likes: {
              increment: 1,
            },            
          },
        });
        return updatedComment;
      }

    return comment.likes;
  }
  ),


  createPostComment: privateProcedure.input(z.object({replyToPostId: z.string(),
      content: z.string().min(1, {message: "post_too_short"}).max(200, {message: "comment_too_long"})
  }))
  .mutation(async ({ctx, input}) => {
    const authorId = ctx.curretnUserId;
    const {success} = await ratelimitPost.limit(authorId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "TOO_MANY_REQUESTS"});

    const comment = await ctx.prisma.comment.create({
        data:{
            content: input.content,
            replyToPostId: input.replyToPostId,
            authorId: authorId,
        }
    });

    await ctx.prisma.post.update({
      data:{
        commentCount: {
          increment: 1,
        }
      },
      where: {
        id: input.replyToPostId
      }
    })

    return comment;
  }),

createCommentReply: privateProcedure.input(z.object({replyToCommentId: z.string(),
    content: z.string().min(1, {message: "post_too_short"}).max(200, {message: "comment_too_long"})
}))
.mutation(async ({ctx, input}) => {
  const authorId = ctx.curretnUserId;
  const {success} = await ratelimitPost.limit(authorId);
  if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "TOO_MANY_REQUESTS"});

  const comment = await ctx.prisma.comment.create({
      data:{
          content: input.content,
          replyToCommentId: input.replyToCommentId,
          authorId: authorId,
      }
  });

  await ctx.prisma.comment.update({
    data:{
      commentCount: {
        increment: 1,
      }
    },
    where: {
      id: input.replyToCommentId
    }
  })

  return comment;
}),

});
