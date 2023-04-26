import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChangeEvent, FormEvent, Fragment, SyntheticEvent, useEffect, useState } from "react";
import { Controller, FieldValues, UseFormRegister, UseFormSetError, useForm, FieldErrors } from 'react-hook-form';
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { setErrorMap, z } from "zod";
import { api } from "~/utils/api";
import { useFilePicker } from 'use-file-picker';
import { Show } from "@chakra-ui/react";
import Image from "next/image"

//@ts-ignore
function classNames(...classes) {
return classes.filter(Boolean).join(' ')
}


interface UploadProgress {
    [fileName: string]: number;
  }
  
  
  
//create react hook validation schema for post
const postSchema = z.object({
    content: z.string().min(4, {message: "post_too_short"}),
    file_upload: z.string().nullable()
  });
  
  type postFormSchema = z.infer<typeof postSchema>;
  
export const PostCreator = () => {
    const {register, setValue , setError,control,formState: {errors}} = useForm<postFormSchema>({
      resolver: zodResolver(postSchema)
    });
    const {user} = useUser();
    const ctx = api.useContext();
    const {t} = useTranslation();


    const [openFileSelector, { filesContent, loading ,errors:pickerError }] = useFilePicker({
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

    // setError('file_upload', {type:"custom", message: t('upload_image_too_big') + maxImageSize + 'mb'}) ;
    // setError('file_upload', {type:"custom", message: t('upload_video_too_big') + maxVideoSize + 'mb'}) ;
    // setError('file_upload', {type:"custom", message: t('upload_videos_too_big') + maxVideoSize + 'mb'}) ;


    async function uploadToS3() {
        let keys = [];

        //@ts-ignore
        for (let i = 0; i < filesContent.length; i++) {
          //@ts-ignore
            let file = filesContent[i];
            console.log(file)

            //@ts-ignore
            const fileType = encodeURIComponent(file?.type);
            console.log("type", fileType);

            const {data} = await axios.post(`/api/upload/processMediaUpload?fileType=${fileType}`);
            const {uploadUrl, key} = data;
            keys.push({uploadUrl, key});
            await axios.put(uploadUrl, file)
            .catch(e => {
                toast (e.message);
                console.log(e.message);
            });
        }
        return keys;
    }


    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
          e.preventDefault();

       try{
         const keys = await uploadToS3();
         console.log(keys);
        
       } catch(cause){
            setError('content', {type: "custom", message: "媒体文件上传失败"});
       }

       return null;
    }
    

    return <> 
    <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-start space-x-4 ">
        <div className="flex-shrink-0">
            <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
            width={60}
            height={60}
            className="flex-none rounded-full bg-gray-50" />
        </div>

        <div className="min-w-0 flex grow w-full">
        <form action="#" className="relative flex grow">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 flex grow">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              defaultValue={''}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
    {/* comment section */}

    </div>
  
    </>
  }
  
  