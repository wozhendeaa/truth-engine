// import { useUser } from "@clerk/nextjs";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SyntheticEvent, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { useTranslation } from "react-i18next";
// import { z } from "zod";
// import { api } from "utils/api";
// import { LoadingSpinner } from "../loading";

// //create react hook validation schema for post
// const postSchema = z.object({
//     content: z.string().min(4, {message: "post_too_short"}),
//   });
  
//   type postFormSchema = z.infer<typeof postSchema>;
  
//   export const PostCreator = () => {
//     const [newPost, setPost] = useState("");
//     const {register, handleSubmit, formState: {errors}} = useForm<postFormSchema>({
//       resolver: zodResolver(postSchema)
//     });
//     const {user} = useUser();
//     const ctx = api.useContext();
//     const {t} = useTranslation();
  
//     if(!user) return null;
  
//     const {mutate, isLoading: isPosting} = api.posts.createPost.useMutation({
//       onSuccess: () => {
//         setPost("");
//         void ctx.posts.getAll.invalidate();
//       },
//       onError: (e) => {
//          const errorMessage = e.data?.code;
//          if (errorMessage) {
//           toast.error(t(errorMessage));       
//          } 
//       }     
//     });
  
//     function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
//       return (event: SyntheticEvent) => {
//         if (promise) {
//           promise(event).catch((error) => {
//             console.log("Unexpected error", error);
//           });
//         }
//       };
//     }
  
//     const onSubmit= (data : postFormSchema) => {
//       if (!errors.content) {
//         mutate(data);
//       }
//     }
    
//     return <> 
//     <div className="flex gap-3 w-full ">
//     <Image src={user.profileImageUrl}
//        alt="profile image"
//        className="w-14 h-14 rounded-full" width="56"  height="56" />
//       <form onSubmit={ onPromise(handleSubmit(onSubmit))} className="flex gap-3 w-full ">
//       <input placeholder="type"
//        className="grow bg-transparent outline-none "
//        value={newPost}
//        onKeyDown={(e) => {      
//            if(e.key === "Enter") {
//             e.preventDefault();
//             if (errors.content) {
//               toast.error(t("post_too_short"));
//             } else {
//               mutate({content: newPost});
//             }            
//        }}}
//        disabled={isPosting}
//        aria-invalid={errors.content ? "true" : "false"} 
//        {...register("content", {required:true, onChange: (e: React.FormEvent<HTMLInputElement>) => setPost(e.currentTarget.value)})}  
//        />
//       {errors.content ? <span className="text-red-500 absolute top-center right-center flex items-center justify-center">{t('post_too_short')}</span>: null}
  
//      {!isPosting && <button disabled={isPosting}  type="submit"
//        className="bg-slate-400 text-white px-4 py-2 rounded-md"> {t("post")}</button>}
//        {isPosting && <div className="flex items-center justify-center"><LoadingSpinner size={20}/></div>}
//       </form>
//     </div>
//     </>
//   }
  
  