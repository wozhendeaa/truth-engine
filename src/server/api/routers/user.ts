import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { useContext } from 'react';
import { api } from "~/utils/api";
import { prisma } from '../../db';
import { createTRPCProxyClient } from "@trpc/client";
import { useRouter } from 'next/router';
import { getAuth } from "@clerk/nextjs/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";



export const userRouter = createTRPCRouter({

 prepareNewUser: publicProcedure.input(z.object({
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
}}

})});

