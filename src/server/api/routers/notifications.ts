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
    .input(z.object({ postId: z.string(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      let reports = await ctx.prisma.report.findMany({
        where: {
          postId: input.postId,
          post: {
            MarkAsDelete: false,
          },
        },
        take: input.limit,
        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
              premiumStatus: true,
              role: true,
              displayname: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!reports) reports = [];

      return {
        props: {
          reports: reports,
        },
      };
    }),
});
