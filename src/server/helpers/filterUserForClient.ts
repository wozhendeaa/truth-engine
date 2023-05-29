import { User as clerkUser } from "@clerk/nextjs/dist/api";
import { User as MyUser} from "@prisma/client";
export const filterClerkUserForClient = (user: clerkUser) => {
    return {id: user.id, username: String(user.firstName) + " " + String(user.lastName), profileImageUrl: user.profileImageUrl}
}

export const filterMyUserForClient = (user: MyUser) => {
    return {id: user.id, username: user.username, profileImageUrl: user.profileImageUrl, displayName: user.displayname, 
    email: user.email}
}
