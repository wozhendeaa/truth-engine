import { TRPCError } from "@trpc/server";
import { any, z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { postSchema } from "components/posting/PostBox";
import { RouterOutputs } from "utils/api";
import { createTRPCContext } from '../trpc';
import type Prisma  from "@prisma/client";
import { ReactionType } from "@prisma/client";



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

function classifyMedia(filename: string): "image" | "video" | undefined {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "webm", "ogg", "avi", "mov", "wmv"];

  const extension = filename.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return "image";
  } else if (extension && videoExtensions.includes(extension)) {
    return "video";
  } else {
    return undefined;
  }
}

type postAuthorType = (Prisma.Post & {author: Prisma.User})[]
let cursor = "";

export const postsRouter = createTRPCRouter({
  getCommentsForPost: publicProcedure.input(z.object({id: z.string(), limit:  z.number()}))
  .query(async ({ctx, input}) => {
     const comments = await ctx.prisma.comment.findMany({
      where:{
        replyToPostId: input.id,
      },
      include: {
        author: true
      },
      orderBy:[
        {pinned: "asc",},
        {likes: "desc",},
        {createdAt: "desc",}
      ],
      take: input.limit
    })

    return comments;
  }),


  getPostById: publicProcedure.input(z.object({id: z.string()}))
  .query(async ({ctx, input}) => {
   const post = await ctx.prisma.post.findUnique({
        where:{
            id: input.id
        },
        include: {
          author: true,
          reactions: {
            where:{
                userId: ctx.userId ?? ""
            }
          }
        }
    })

    if (!post) throw new TRPCError({code: "NOT_FOUND", message: "没有找到文章"});
    return post;
  }
  ),

 likePost: privateProcedure.input(z.object({postId: z.string()}))
    .mutation(async ({ctx, input}) => {
     
    const userId = ctx.curretnUserId;
    const {success} = await ratelimitPost.limit(userId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too many requests"})
  
    const post = await ctx.prisma.post.findUnique({
          where:{
              id: input.postId
          },   

          include: {
            reactions: {
              where :{
                 userId: userId,
                 postId: input.postId
              }
            }
          }
      })

      if (!post) throw new TRPCError({code: "NOT_FOUND", message: "点赞时没有找到要点赞的帖子id"});

      if (post.reactions?.length > 0) {
        const deleteUser = await ctx.prisma.reaction.delete({
          where: {
            id: post.reactions[0]?.id,
          },
        })

        const updatedPost = await ctx.prisma.post.update({
          where: {
            id: input.postId,
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
            postId: input.postId,
          },
        });

        const updatedPost = await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            likes: {
              increment: 1,
            },            
          },
        });
        return updatedPost;
      }

    return post.likes;
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

  getAllWithReactionsDataForUser: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take:100,   
        orderBy: [{createdAt: "desc"}],
        where: {
          author:{
            role: {in: ['ADMIN_VERYFIED_ENGINE','VERYFIED_ENGINE']}
          },
          MarkAsDelete: false
        } ,       
        include: {
          author: true,     
          reactions: {
            where: {
              userId: ctx.userId ?? "",
            }
          }     
        },
    });

    return {
        posts,
    };
 
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take:100,   
        orderBy: [{createdAt: "desc"}],
        include: {
          author: true,
          reactions: {
            where: {
              userId: ctx.userId ?? "",
            }
          }     
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
          author:true,
        }
    })
    )
    ,


  createPost: privateProcedure.input(
    postSchema
  ).mutation(async ({ctx, input}) => {
    const authorId = ctx.curretnUserId;
    const {success} = await ratelimitPost.limit(authorId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS", message: "too many requests"});

    let mediaString = "";
    if (input.media) {
      let files = JSON.parse(input.media);
      let processedFiles = [];
      for  (let file of files) {
        const ext = file.key.split(".").pop();
        const type = classifyMedia(ext);
         processedFiles.push({type: type, 
          url: process.env.AWS_S3_IMAGE_BUCKET_URL + file.key}
         );
      }
     mediaString = JSON.stringify(processedFiles);
    }

    const post = await ctx.prisma.post.create({
        data:{
            authorId,
            content: input.content,
            media: mediaString,
        }
    });
    return post;
  }),


  
});
