import { createApiRouter, createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  profile:profileRouter,
  user:  userRouter,
});

export const apiRouter = createApiRouter({
  user:  userRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter;
