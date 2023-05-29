// pages/prepare-new-user.tsx
import { api } from "utils/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "server/db";
import { apiRouter, appRouter } from "server/api/root";
import { createContext } from "react";
import { createTRPCContext } from "server/api/trpc";
import { trpcCaller } from "server/helpers/trpcCallerHelper";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { TRPCError } from "@trpc/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userFormData = req.body;
  const context = await createTRPCContext({
    req,
    res,
  });

  const caller = appRouter.createCaller(context);
  try {
    //检查用户名和邮件是否存在
    const isUserNameTaken = await caller.user.isUsernameTaken({
      username: userFormData.username,
    });
    const isEmailTaken = await caller.user.isEmailTaken({
      email: userFormData.email,
    });

    if (isUserNameTaken || isEmailTaken) {
      const errors = {
        username: isUserNameTaken ? "username_taken" : null,
        email: isEmailTaken ? "email_taken" : null,
      };
      return res.status(400).json({ message: "register_failed", errors });
    }

    await caller.user.addOrUpdateUser(userFormData);
    res.status(200).json({ message: "register_success" });
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);

      return res.status(httpCode).json({ errors: cause });
    }
    // Another error occured
    console.error(cause);
    res.status(500).json({ errors: "server_error" });
  }
}
