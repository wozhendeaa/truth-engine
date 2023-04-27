import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";


//create react hook validation schema for post
export const postSchema = z.object({
  content: z.string().min(4, {message: "post_too_short"}),
});

type postFormSchema = z.infer<typeof postSchema>;
export default postFormSchema;


const ratelimit = new Ratelimit({
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


export const postsRouter = createTRPCRouter({
  getPostById: publicProcedure.input(z.object({id: z.string()})).query(async ({ctx, input}) => {
   const post = await ctx.prisma.post.findUnique({
        where:{
            id: input.id
        },
        include: {
          author: true
        }
    })

    if (!post) throw new TRPCError({code: "NOT_FOUND", message: "没有找到文章"});
    return post;
  }
  ),

  getPublicTimelineFeed: publicProcedure.query(async ({ ctx }) => {
       
      const feed = await ctx.prisma.post.findMany({
        where:{
            author: {
              role: 'ADMIN_VERYFIED_ENGINE' || 'VERYFIED_ENGINE'
            }
        },
        orderBy: {createdAt: "desc"},
        take: 100,
      }
    )
    return feed;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take:100,   
        orderBy: [{createdAt: "desc"}],
        include: {
          author: true
        }
    });

    return posts;
  }),

  //a public trpc procedure that gets all posts by author id(user id)
  getPostsByUserId: publicProcedure
  .input(z.object({userId: z.string()}))
  .query(({ctx, input}) => 
    ctx.prisma.post.findMany({
        take:100,   
        where:{
            authorId: input.userId
        },
        orderBy: [{createdAt: "desc"}],
        include: {
          author:true
        }
    })
    )
    ,


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
