import Image from"next/image"
import Link from "next/link";
import dayjs from "dayjs"
import relativetTime from "dayjs/plugin/relativeTime"
import { type RouterOutputs } from "utils/api";
dayjs.extend(relativetTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const Postview = (props: PostWithUser) => {
    const username = String(props.author.username).toString();

    return(
        <div key={props.id} className="flex gap-3 border-b border-slate-400 p-8 font-chinese">
          <Image 
          src={props.author.profileImageUrl ?? "/images/default_avatar.png"}
          className="w-12 h-12 rounded-full" alt="头像"
          width="56"
          height="56" />          
          
          <div className="flex flex-col">
            <div className="flex text-slate-300">              
              <Link href={`/user/${username}`}><span>{`@${username}`}</span> </Link>
              <span className="mx-1">·</span>
              <Link href={`/post/[id]`} as={`/post/${props.author.id}`} >
                <span className="font-thin">{dayjs(props.createdAt).fromNow()}</span>
              </Link>
            </div>


          <span>{props.content} </span>       

          </div>
          
        </div>      
    );
}

export default Postview;