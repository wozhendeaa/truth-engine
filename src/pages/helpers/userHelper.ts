
import { User } from '@prisma/client';
import { useAppSelector } from 'Redux/hooks';

export function isUserVerified(user: User | null) {
  if(!user) {
    return false;
  };

  let isVerified: boolean = user.role === "ADMIN_VERYFIED_ENGINE" 
  || user.role === "VERYFIED_ENGINE";

  return isVerified;
}

//不要用这个
// export function getMyUser() {
//   const user = useAppSelector((state) => state.user.user);
//   return user;
// }