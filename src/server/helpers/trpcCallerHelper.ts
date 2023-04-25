import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../api/root";
import { createTRPCContext } from "../api/trpc";
import { prisma } from "../db";

export const trpcCaller = async (req: NextApiRequest, res: NextApiResponse) => {
    const context = await createTRPCContext({
        req,
        res,
    });

    const caller = appRouter.createCaller(context);

    return caller;
}