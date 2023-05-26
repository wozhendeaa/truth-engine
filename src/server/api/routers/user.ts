import { Schema, boolean, z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "server/api/trpc";
import { prisma } from "../../db";
import { accountSetupSchema } from "pages/NewAccountSetup";
import { Prisma, Role } from "@prisma/client";
import NewUser from "views/admin/main/users/newUser/index";

export const userRouter = createTRPCRouter({
  getCurrentLoggedInUser: publicProcedure.query(async ({ ctx }) => {
    if (ctx.user != null) {
      return ctx.user;
    }

    return null;
  }),

  getUserWithProfileStatsById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const stat = await prisma.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          profileImageUrl: true,
          NiuBi: true,
          displayname: true,
          username: true,
          email: true,

          // Count the number of posts
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });

      return stat;
    }),

  getUserWithProfileStatsByUserName: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const stat = await prisma.user.findFirst({
        where: {
          username: input.username,
        },
        select: {
          id: true,
          profileImageUrl: true,
          NiuBi: true,
          displayname: true,
          username: true,
          email: true,
          role: true,
          premiumStatus: true,

          // Count the number of posts
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });

      return stat;
    }),

  isCurrentUserVerifiedEngine: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return false;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: ctx.userId,
        OR: [
          { role: Role.VERYFIED_ENGINE },
          { role: Role.ADMIN_VERYFIED_ENGINE },
        ],
      },
    });

    return user !== null || user !== undefined;
  }),

  doesUserExist: publicProcedure
    .input(
      z.object({
        userId: z.string().nullable().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      //看用户数据有没有在我的数据库记录
      let user = null;
      if (input.userId) {
        user = await prisma.user.findFirst({
          where: {
            id: input.userId,
          },
        });

        const isNew = user == null;
        return {
          props: {
            user,
            isNew,
          },
        };
      }
    }),

  isEmailTaken: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        select: {
          email: true,
        },
        where: {
          email: input.email,
        },
      });
      return user != null;
    }),

  getAuthorizedUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { role: Role.VERYFIED_ENGINE },
          { role: Role.ADMIN_VERYFIED_ENGINE },
        ],
      },
    });

    return users;
  }),

  isUsernameTaken: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        select: {
          username: true,
        },
        where: {
          username: input.username,
        },
      });
      return user != null;
    }),

  addOrUpdateUser: privateProcedure
    .input(accountSetupSchema)
    .mutation(async ({ ctx, input }) => {
      const newUser = {
        username: input.username,
        email: input.email,
        displayname: input.displayName,
        id: input.userId,
        profileImageUrl: input.profileImageUrl,
      };

      const existingUser = await prisma.user.findFirst({
        where: {
          id: newUser.id,
        },
      });

      if (existingUser) {
        await prisma.user.update({
          where: {
            id: input.userId,
          },
          data: newUser,
        });
      } else {
        try {
          const createUser = await prisma.user.create({
            data: newUser,
          });

          const follow = {
            followerId: input.userId,
            followingId: "user_2OPYWsRQjk1Lv7EjSAOffkpzxEL", //默认跟踪小明教授
            recieveImportantNotification: input.receiveNotification,
          };

          const existFollow = await prisma.userFollows.findFirst({
            where: {
              followingId: follow.followerId,
              followerId: follow.followerId,
            },
          });

          if (!existFollow) {
            const createFollowing = await prisma.userFollows.create({
              data: follow,
            });
          }
        } catch (error) {
          return ctx.res?.status(500).json({ errors: error });
        }
      }
    }),
});
