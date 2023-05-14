// pages/prepare-new-user.tsx
import { api } from 'utils/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from 'server/db';

export default async function handler(req:  NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return null;
  
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    return null;
  }

  return res.status(200).json({user: user});
}
