import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";


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

    const post = await ctx.prisma.post.create({
        data:{
            authorId,
            content: input.content,
        }
    });
    return post;
  })
});
