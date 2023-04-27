import { Schema, z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { prisma } from '../../db';
import {accountSetupSchema} from '~/pages/NewAccountSetup'
import { Prisma } from "@prisma/client";


export const userRouter = createTRPCRouter({

 doesUserExist: publicProcedure.input(z.object({
  userId: z.string().nullable().nullish()
 })).query(async ({ctx, input}) => {

  //看用户数据有没有在我的数据库记录    
    let user = null;
    if (input.userId) {
      user = await prisma.user.findFirst({
        where: {
          id: input.userId
        }
      })
  
   const isNew = user == null;
   return {
    props: {
      user,
      isNew,
   }
}}}),

   isEmailTaken: publicProcedure.input(z.object({email: z.string()}))
   .query(async ({ctx, input}) => {
       const user = await prisma.user.findFirst({
        select: {
          email:true,
          id:true
        },
       where: {
         email: input.email,

       }
     })
     return user != null && user.id == ctx.userId
   }),
  
   getAuthorizedUsers: publicProcedure.query(async ({ctx}) => {
    const users = await prisma.user.findMany({
      where: {
         role: 'ADMIN_VERYFIED_ENGINE' || 'VERYFIED_ENGINE'
      }
   })

   return users;
   }),

   isUsernameTaken: publicProcedure.input(z.object({username: z.string()}))
   .query(async ({ctx, input}) => {
       const user = await prisma.user.findFirst({
        select: {
          username:true,
          id:true
        },
       where: {
        username: input.username
       }
     })
     return user != null && user.id == ctx.userId                  
   }),

    registerInMyDatabase: privateProcedure
    .input(accountSetupSchema)
    .mutation(async ({ctx, input}) => {

      const user = {
        username: input.username,
        email: input.email,
        displayname: input.displayName,
        id: input.userId,
      }

      await prisma.user.create({
        data:user
      })

      const follow = {
        followerId: input.userId, //#doto, change this to my userid
        followingId: input.userId,
        recieveImportantEmailNotification: input.receiveNotification,
     }

      await prisma.userFollows.create({
        data: follow
      })
      
    }),
  });


