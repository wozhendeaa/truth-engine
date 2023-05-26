import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { inputStyles } from "theme/components/input";
import { Select } from "@chakra-ui/react";

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

export const notificationRouter = createTRPCRouter({
  getNotificationForUser: privateProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.number(), createdAt: z.date() }).optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input: { limit = 30, cursor } }) => {
      let notifications = await ctx.prisma.postCommentNotification.findMany({
        where: {
          receiverId: ctx.curretnUserId,
          hasRead: false,
        },
        cursor: cursor ? { id_createdAt: cursor } : undefined,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
              premiumStatus: true,
              role: true,
              displayname: true,
            },
          },
          comment: {
            select: {
              content: true,
            },
          },
          post: {
            select: {
              content: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!notifications) notifications = [];

      let nextCursor: typeof cursor | undefined;
      if (notifications.length > limit) {
        const nextItem = notifications.pop();
        if (nextItem) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }
      return { notifications, nextCursor };
    }),
});
