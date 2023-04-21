import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter,  publicProcedure } from "~/server/api/trpc";
import { filterMyUserForClient } from "~/server/helpers/filterUserForClient";



export const profileRouter = createTRPCRouter({

    getUserByUsername: publicProcedure.input(z.object({
        username: z.string()
    })).query(async ({ input, ctx}) => {
        const user = await ctx.prisma.user.findFirst({
            where: {
                username: input.username
            }           
        });

        //check if user is null, it it is throw error
        if(user == null){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }
        return filterMyUserForClient(user);
    })}
);

