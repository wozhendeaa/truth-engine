import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */ 
    prefix: "@upstash/ratelimit",
  });

const filterUserForClient = (user: User) => {
    const name = user.firstName;
    return {id: user.id, username: name, profileImageUrl: user.profileImageUrl}
}

export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take:100,   
        orderBy: [{createdAt: "desc"}],
    });

    const users = (await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit:100 
    })).map(filterUserForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id == post.authorId);
        if (!author || !author.username) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "author for post not found"});
        return {
            post,
            author
        };
    });

  }),

  createPost: privateProcedure.input(z.object({
    content:z.string().min(1),
  })).mutation(async ({ctx, input}) => {
    const authorId = ctx.curretnUserId;
    const {success} = await ratelimit.limit(authorId);
    if (!success) throw new TRPCError({code: "BAD_REQUEST", message: "发送请求太过频繁"});

    const post = await ctx.prisma.post.create({
        data:{
            authorId,
            content: input.content,
        }
    });
    return post;
  })
});
