import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { filterClerkUserForClient } from "~/server/helpers/filterUserForClient";
import { Post } from "@prisma/client";

const addUserDataToPost = async (posts:Post[]) => {
  const users = (await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit:100 
    })).map(filterClerkUserForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id == post.authorId);
        if (!author || !author.username) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "author for post not found"});
        return {
            post,
            author
        };
    });
}

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "60 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */ 
    prefix: "@upstash/ratelimit",
  });


export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take:100,   
        orderBy: [{createdAt: "desc"}],
    });

    return addUserDataToPost(posts);
  }),

  //a public trpc procedure that gets all posts by author id(user id)
  getPostsByUserId: publicProcedure
  .input(z.object({userId: z.string()}))
  .query(({ctx, input}) => {
    const posts = ctx.prisma.post.findMany({
        take:100,   
        where:{
            authorId: input.userId
        },
        orderBy: [{createdAt: "desc"}],
    }).then(addUserDataToPost)
    return posts;
    }),


  createPost: privateProcedure.input(z.object({
    content:z.string().min(1, {message: "post_too_short"}),
  })).mutation(async ({ctx, input}) => {
    const authorId = ctx.curretnUserId;
    const {success} = await ratelimit.limit(authorId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too many requests"});

    const post = await ctx.prisma.post.create({
        data:{
            authorId,
            content: input.content,
        }
    });
    return post;
  })
  

  
});
