import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
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

export const faqRouter = createTRPCRouter({
  getFAQ: publicProcedure.query(async ({ ctx }) => {
    let faqs = await ctx.prisma.fAQ.findMany({
      include: {
        category: true,
      },
    });
    return faqs;
  }),

  createFAQ: privateProcedure
    .input(
      z.object({
        replyToPostId: z.string(),
        content: z
          .string()
          .min(1, { message: "post_too_short" })
          .max(200, { message: "comment_too_long" }),
      })
    )
    .mutation(async ({ ctx, input }) => {}),
});
