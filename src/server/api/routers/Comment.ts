import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { Reaction, ReactionType } from "@prisma/client";
const truthConfig = require("truth-engine-config");

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
  getCommentsForPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        limit: z.number().default(50),
        commentId: z.string().optional(), //把用户从通知或者主页哪里要查看的那条评论也找出来
      })
    )
    .query(async ({ ctx, input }) => {
      let comments = await ctx.prisma.comment.findMany({
        where: {
          OR: [
            {
              id: input.commentId, //指定评论
            },
            {
              //或者是某个帖子的所有评论
              replyToPostId: input.postId,
              MarkAsDelete: false,
            },
          ],
        },
        take: input.limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
              premiumStatus: true,
              role: true,
              displayname: true,
            },
          },
          reactions: {
            where: {
              userId: ctx.user?.id,
            },
          },
        },
        orderBy: [
          {
            likes: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });
      if (!comments) comments = [];

      return {
        props: {
          comments: comments,
        },
      };
    }),

  getUserNewCommentForComment: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ ctx, input }) => {
      let comment = await ctx.prisma.comment.findMany({
        where: {
          replyToCommentId: input.commentId,
          MarkAsDelete: false,
        },
        take: 1,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
              premiumStatus: true,
              role: true,
              displayname: true,
            },
          },
          reactions: {
            where: {
              userId: ctx.user?.id,
            },
          },
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });

      return {
        props: {
          comment,
        },
      };
    }),

  getCommentsForUser: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      let comments = await ctx.prisma.comment.findMany({
        where: {
          author: {
            id: input.userId,
          },
          replyToComment: null,
          MarkAsDelete: false,
        },
        take: input.limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
              premiumStatus: true,
              role: true,
              displayname: true,
            },
          },
          post: {
            select: {
              id: true,
            },
          },

          reactions: {
            where: {
              userId: ctx.user?.id,
            },
          },
        },
        orderBy: [
          {
            likes: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });
      if (!comments) comments = [];

      return {
        comments,
      };
    }),

  getCommentsForComment: publicProcedure
    .input(z.object({ commentId: z.string(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      let comments = await ctx.prisma.comment.findMany({
        where: {
          replyToCommentId: input.commentId,
          MarkAsDelete: false,
        },
        take: input.limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
              premiumStatus: true,
              role: true,
              displayname: true,
            },
          },
          reactions: {
            where: {
              userId: ctx.user?.id,
            },
          },
        },
        orderBy: [
          {
            likes: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      });

      if (!comments) comments = [];

      return {
        props: {
          comments: comments,
        },
      };
    }),

  likeComment: privateProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.curretnUserId;
      const { success } = await ratelimitPost.limit(userId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "too many requests",
        });

      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.commentId,
          MarkAsDelete: false,
        },

        include: {
          reactions: {
            where: {
              userId: ctx.user?.id,
              commentID: input.commentId,
            },
          },
        },
      });

      if (!comment)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "点赞时没有找到要点赞的评论id",
        });
      const niubi = truthConfig.economy.recieveComment as number;

      if (comment.reactions?.length > 0) {
        const deleteUser = await ctx.prisma.reaction.delete({
          where: {
            id: comment.reactions[0]?.id,
          },
        });

        await ctx.prisma.postCommentNotification.deleteMany({
          where: {
            senderId: ctx.curretnUserId,
            commentId: input.commentId,
            type: "LIKE_COMMENT",
          },
        });

        const updatedComment = await ctx.prisma.comment.update({
          where: {
            id: input.commentId,
          },
          data: {
            likes: {
              decrement: 1,
            },
            author: {
              update: {
                NiuBi: {
                  decrement: niubi,
                },
              },
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
            author: {
              update: {
                NiuBi: {
                  increment: niubi,
                },
              },
            },
          },
        });

        if (ctx.curretnUserId !== comment.authorId) {
          await ctx.prisma.postCommentNotification.create({
            data: {
              senderId: ctx.curretnUserId,
              receiverId: comment.authorId,
              commentId: comment.id,
              type: "LIKE_COMMENT",
              content: "",
            },
          });
        }

        return updatedComment;
      }

      return comment.likes;
    }),

  createPostComment: privateProcedure
    .input(
      z.object({
        replyToPostId: z.string(),
        content: z
          .string()
          .min(1, { message: "post_too_short" })
          .max(200, { message: "comment_too_long" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const commentorId = ctx.curretnUserId;

      const { success } = await ratelimitPost.limit(commentorId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "TOO_MANY_REQUESTS",
        });

      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          replyToPostId: input.replyToPostId,
          authorId: commentorId,
        },
      });

      const post = await ctx.prisma.post.update({
        data: {
          commentCount: {
            increment: 1,
          },
        },
        where: {
          id: input.replyToPostId,
        },
      });

      //增加牛币
      const authorNiubi = truthConfig.economy.recieveComment as number;
      const result = await ctx.prisma.$executeRaw`
    UPDATE User
    SET NiuBi = NiuBi + ${authorNiubi}
    WHERE id = (
        SELECT authorId
        FROM Post
        WHERE id = ${input.replyToPostId} AND ${commentorId} != User.id

    )`;

      if (ctx.curretnUserId !== post.authorId) {
        //通知
        await ctx.prisma.postCommentNotification.create({
          data: {
            senderId: ctx.curretnUserId,
            receiverId: post.authorId,
            type: "REPLY",
            content: input.content,
            postId: post.id,
          },
        });
      }

      return comment;
    }),

  createCommentReply: privateProcedure
    .input(
      z.object({
        replyToCommentId: z.string(),
        content: z
          .string()
          .min(1, { message: "post_too_short" })
          .max(200, { message: "comment_too_long" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.curretnUserId;
      const { success } = await ratelimitPost.limit(authorId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "TOO_MANY_REQUESTS",
        });

      const commentToReply = await ctx.prisma.comment.findUnique({
        where: {
          id: input.replyToCommentId,
        },
      });

      if (!commentToReply)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "回复评论时找不到要回复的评论id ",
        });

      let commentData = {
        content: input.content,
        replyToCommentId: input.replyToCommentId,
        replyToPostId: commentToReply.replyToPostId,
        authorId: authorId,
      };

      const newComment = await ctx.prisma.comment.create({
        data: commentData,
      });

      await ctx.prisma.comment.update({
        data: {
          commentCount: {
            increment: 1,
          },
        },
        where: {
          id: commentData.replyToCommentId,
        },
      });

      if (ctx.curretnUserId !== commentToReply.authorId) {
        //通知
        await ctx.prisma.postCommentNotification.create({
          data: {
            senderId: ctx.curretnUserId,
            receiverId: commentToReply.authorId,
            type: "REPLY",
            content: input.content,
            postId: commentToReply.replyToPostId,
            commentId: commentToReply.id,
          },
        });
      }

      return newComment;
    }),
});
