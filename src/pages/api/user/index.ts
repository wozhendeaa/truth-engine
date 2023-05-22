// pages/prepare-new-user.tsx
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from 'server/db';
import TE_Routes from 'TE_Routes';

export default async function handler(req:  NextApiRequest, res: NextApiResponse) {
  
  const { userId } = getAuth(req);
  if (!userId) throw new Error("用户没有登录");
  
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    return res.redirect(TE_Routes.NewAccountSetup.path)
  }

  return res.redirect(TE_Routes.Index.path)
}
