import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcesure, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
    const name = user.firstName;
    return {id: user.id, username: name, profileImageUrl: user.profileImageUrl}
}

export const postsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
        take:100,        
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

  createPost: privateProcesure.input(z.object({
    content:z.string().min(1)
  })).mutation(async ({ctx, input}) => {
    const authorId = ctx.curretnUser.id;

    const post = await ctx.prisma.post.create({
        data:{
            authorId,
            content: input.content,
        }
    })
  })
});
