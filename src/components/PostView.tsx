import Image from"next/image"
import Link from "next/link";
import dayjs from "dayjs"
import relativetTime from "dayjs/plugin/relativeTime"
import { RouterOutputs, api } from "~/utils/api";
dayjs.extend(relativetTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const Postview = (props: PostWithUser) => {
    const {post, author} = props;
    const username = String(author.username).toString();

    return(
        <div key={post.id} className="flex gap-3 border-b border-slate-400 p-8 ">
          <Image 
          src={author.profileImageUrl}
          className="w-12 h-12 rounded-full" alt="头像"
          width="56"
          height="56" />          
          
          <div className="flex flex-col">
            <div className="flex text-slate-300">              
              <Link href={`/@${username}`}><span>{`@${username}`}</span> </Link>
              <span className="mx-1">·</span>
              <Link href={`/posts/${post.id}`}>
                <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
              </Link>
            </div>
          <span>{post.content} </span>          
          </div>
        </div>      
    );
}

export default Postview;