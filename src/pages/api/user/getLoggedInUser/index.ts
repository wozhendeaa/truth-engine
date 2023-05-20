// pages/prepare-new-user.tsx
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from 'server/db';

export default async function handler(req:  NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId)  return res.status(200).json({user: null});;
  
  try{
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    return res.status(200).json({user: user});
    
  } catch(cause) {
    if (cause instanceof Error) {
      return res.status(500).json({user: null,message: cause.message})
    }
    // Handle any other exceptions
    return res.status(500).json({user: null,message: '发生未知错误'})
  }
}
