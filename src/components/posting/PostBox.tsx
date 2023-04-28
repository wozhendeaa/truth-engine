import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChangeEvent, FormEvent, Fragment, SyntheticEvent, useState } from "react";
import { Controller, FieldValues, UseFormRegister, UseFormSetError, useForm, FieldErrors } from 'react-hook-form';
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { setErrorMap, z } from "zod";
import { api } from "~/utils/api";
import { useFilePicker } from 'use-file-picker';
import { Show } from "@chakra-ui/react";
import Image from "next/image"
import { watch } from "fs";
import S3 from "aws-sdk/clients/s3";

//@ts-ignore
function classNames(...classes) {
return classes.filter(Boolean).join(' ')
}


interface UploadProgress {
    [fileName: string]: number;
  }
  
  //create react hook validation schema for post
export const postSchema = z.object({
  content: z.string().min(4, {message: "post_too_short"}),
  media: z.string().optional()
});
type postFormSchema = z.infer<typeof postSchema>;

  
  
export const PostCreator = () => {
    const {register, setValue , watch, setError,control,formState: {errors}} = useForm<postFormSchema>({
      resolver: zodResolver(postSchema)
    });
    const {mutate, isLoading: isPosting} = api.posts.createPost.useMutation({
      onSuccess: () => {
        setValue('content', "null");
        void ctx.posts.getAll.invalidate();
      },

      onError: (e) => {
         const errorMessage = e.data?.code;
         if (errorMessage) {
          toast.error(t(errorMessage));       
         } 
      }     
    });

    const {user} = useUser();
    const ctx = api.useContext();
    const {t} = useTranslation();


    const [openFileSelector, { filesContent, loading ,errors:pickerError, clear  }] = useFilePicker({
          readAs: 'DataURL',
          accept: 'image/*',
          multiple: true,
          limitFilesConfig: { max: 5 },
          // minFileSize: 0.1, // in megabytes
          maxFileSize: 5,
          imageSizeRestrictions: {
            maxHeight: 2000, // in pixels
            maxWidth: 1920,
            minHeight: 100,
            minWidth: 200,
          },
    });


    if(!user) return null;
  
   

    // setError('file_upload', {type:"custom", message: t('upload_image_too_big') + maxImageSize + 'mb'}) ;
    // setError('file_upload', {type:"custom", message: t('upload_video_too_big') + maxVideoSize + 'mb'}) ;
    // setError('file_upload', {type:"custom", message: t('upload_videos_too_big') + maxVideoSize + 'mb'}) ;


    async function uploadToS3() {
        let keys = [];
        const s3 = new S3();

        //@ts-ignore
        for (let i = 0; i < filesContent.length; i++) {
          //@ts-ignore
            let file = filesContent[i];
            //@ts-ignore
            const fileType = encodeURIComponent(file?.name.split('.').at(1));
            const {data} = await axios.post(`/api/upload/processMediaUpload?fileType=${fileType}`);
            const {uploadUrl, key} = data;
            keys.push({key,fileType});

            //convert base64 to blob
            const str = 'data:image/' + {fileType} + 'base64,';
            const base64Str = file?.content.toString() ?? "";
            const response = await fetch(base64Str);
            const blob = await response.blob();

            const ss = await axios.put(uploadUrl, blob)
            .then(res => {
                
            })
            .catch(e => {
                toast (e.message);
            });
        }
        return keys;
    }


    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
          e.preventDefault();

          try{
              const keys = await uploadToS3();
              mutate({
                content: watch('content').valueOf(),
                media: JSON.stringify(keys),
              });
              setValue('content', "");   
              clear();
              void ctx.posts.getAll.invalidate();
              
          } catch(cause){
                console.log(cause);
                setError('content', {type: "custom", message: "媒体文件上传失败"});
          }

          return "";
      }
    

    return <>
       <div>
        <div className="grid w-full grow h-auto rounded bg-primary text-primary-content place-content-cente">
            <div className="flex pl-5 pt-5 space-x-3 grow lg:text-xl">
                <div className="h-auto">
                    <Image
                      src={user.profileImageUrl ?? "/images/default_profile.png"} 
                      alt=""
                      width={60}
                      height={60}
                      className="flex-none rounded-full " />
                </div>     
                <div className="w-full pr-6 grow  ">
                <form className="relative mr-[62px] w-full grow" onSubmit={handleSubmit}>
                    <div className="overflow-hidden flex flex-1 rounded-lg pb-12 grow mr-[62px] text-4xl
                    shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <label htmlFor="content" className="sr-only">
                        {t('Add_your_comment')}
                      </label>
                        <textarea
                          {...register('content')}
                          rows={4}
                          disabled={isPosting}
                          name="content"
                          id="content"
                          className="block border-0  w-full
                          lg: text-xl
                           grow font-chinese dark:text-slate-200
                            antialiased bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 min-h-[100px] "
                          placeholder={t('Add_your_comment').toString()}
                          defaultValue={''}
                        />
                    </div>
        
                    <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                      <div className="flex items-center space-x-5">
                        <div className="flex items-center">
                          <button
                            type="button"
                            disabled={isPosting}
                            onClick={() => openFileSelector()}
                            className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <label
                              htmlFor="file_upload"
                              className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className="w-6 h-6" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                              </svg>
                              <span className="sr-only">{t('upload_file')}</span>
                      </label>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPosting}
                  className="rounded-md bg-white px-2.5 py-1.5 text-md mr-[62px]  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {t('post')}
                </button>
              </div>
            </form>
                </div> 
            </div>


        <div className="grid w-full h-auto rounded bg-accent text-accent-content place-content-end items-end">
            {/* image display section */}
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            <div className="sm:p-6 ml-10 mt-auto items-end">
              <ul role="list" className="grid grid-cols-2 ml-6 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 items-end">
                {filesContent.map((file, index) => (
                  <li key={index} className="relative">
                    <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                      <img src={file.content} alt="" className="pointer-events-none object-cover group-hover:opacity-75 aspect-video" />
                      <button type="button" className="absolute inset-0 focus:outline-none">
                        <span className="sr-only">View details for {file.name}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
        </div>
    </div> 
    </div> 

    </>  

  }
  
  