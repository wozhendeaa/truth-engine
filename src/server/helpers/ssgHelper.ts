import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from "~/server/api/root";
import { prisma } from '../db';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';


export const generateSSGHelper =  () => createServerSideHelpers({
    router: appRouter,
    ctx: {prisma, userId: null, user: null, req: null, res: null},
    transformer: superjson, // optional - adds superjson serialization
  });
