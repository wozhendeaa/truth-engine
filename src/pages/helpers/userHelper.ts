
import { User } from '@prisma/client';
import { useAppSelector } from 'Redux/hooks';

export function isUserVerified(user: User | null | undefined) {
  if(!user) {
    return false;
  };

  let isVerified: boolean = user.role === "ADMIN_VERYFIED_ENGINE" 
  || user.role === "VERYFIED_ENGINE";

  return isVerified;
}

export function getMyUser() {
  if (typeof window === 'undefined') return;    
  const userStr = localStorage.getItem('user');
  if (!userStr || userStr === 'undefined') return null;

  return JSON.parse(userStr) as User;
}


export function setMyUser(user: User | null | undefined) {
  if (typeof window === 'undefined') return;    
  if (!user) return;
  localStorage.setItem('user', JSON.stringify(user));
}