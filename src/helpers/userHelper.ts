
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
