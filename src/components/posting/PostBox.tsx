import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { api } from "utils/api";
import { useFilePicker } from "use-file-picker";
import Image from "next/image";
import S3 from "aws-sdk/clients/s3";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useContext, useEffect, useState } from "react";
import { CommentEditor } from "components/ContentCreation/QuillEditor";
import FormLabel from "components/Form/FormLabel";
import Tippy from "components/Tippy";
import Lucide from "components/Lucide";
import Tiptap from "components/TipTap/Tiptap";
import { Flex } from "@chakra-ui/react";
import UserContext from "helpers/userContext";
const i18n = require("next-i18next.config");

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface UploadProgress {
  [fileName: string]: number;
}

//create react hook validation schema for post
export const postSchema = z.object({
  content: z.string().min(1, { message: "post_too_short" }),
  media: z.string().optional(),
});
type postFormSchema = z.infer<typeof postSchema>;

export const PostCreator = () => {
  const {
    register,
    setValue,
    watch,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<postFormSchema>({
    resolver: zodResolver(postSchema),
  });
  const { mutate, isLoading: isPosting } = api.posts.createPost.useMutation({
    onSuccess: () => {
      setValue("content", "null");
      void ctx.posts.getAll.invalidate();
    },

    onError: (e) => {
      const errorMessage = e.data?.code;
      if (errorMessage) {
        toast.error(t(errorMessage));
      }
    },
  });
  const user = useContext(UserContext);
  const ctx = api.useContext();
  const { t, i18n } = useTranslation(["common", "footer"], {
    bindI18n: "languageChanged loaded",
  });
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
    void i18n.reloadResources(i18n.resolvedLanguage, ["common", "footer"]);
  }, []);

  const [
    openFileSelector,
    { filesContent, loading, errors: pickerError, clear },
  ] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
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

  if (!user) return null;

  async function uploadToS3() {
    let keys = [];
    const s3 = new S3();

    //@ts-ignore
    for (let i = 0; i < filesContent.length; i++) {
      //@ts-ignore
      let file = filesContent[i];
      //@ts-ignore
      const fileType = encodeURIComponent(file?.name.split(".").at(1));
      const { data } = await axios.post(
        `/api/upload/processMediaUpload?fileType=${fileType}`
      );
      const { uploadUrl, key } = data;
      keys.push({ key, fileType });

      //convert base64 to blob
      const str = "data:image/" + { fileType } + "base64,";
      const base64Str = file?.content.toString() ?? "";
      const response = await fetch(base64Str);
      const blob = await response.blob();

      const ss = await axios
        .put(uploadUrl, blob)
        .then((res) => {})
        .catch((e) => {
          toast(e.message);
        });
    }
    return keys;
  }

  async function onSubmit(e: postFormSchema) {
    try {
      const keys = await uploadToS3();
      mutate({
        content: watch("content").valueOf(),
        media: JSON.stringify(keys),
      });
      setValue("content", "");
      clear();
      void ctx.posts.getAll.invalidate();
    } catch (cause) {
      setError("content", { type: "custom", message: "媒体文件上传失败" });
    }
    return "";
  }

  function removePictureFromUploader(index: number, divId: string) {
    filesContent.splice(index, 1);
    document.getElementById(divId)?.remove();
    if (filesContent.length === 0) {
      const uploadImageDiv = document.getElementById('uploadImageDiv')
      if (uploadImageDiv) uploadImageDiv.innerHTML = ''
    }
  }

  return (
    <>
      <div>
        <div className="bg-primary text-primary-content place-content-center h-auto w-full">
          <div className="flex grow space-x-3 pl-5 pt-5 lg:text-lg">
            <div className="h-auto shrink-0">
              <Image
                src={user.profileImageUrl ?? "/images/default_profile.png"}
                alt=""
                width={60}
                height={60}
                className="flex-none shrink-0 rounded-full"
              />
            </div>
            <div className="w-[100%]">
              <form
                className="relative"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex w-full flex-1 justify-end rounded-lg  bg-te_dark_ui pb-12 text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label htmlFor="content" className="sr-only">
                    {t("Add_your_comment")}
                  </label>
                  <Flex className="w-[100%]">
                    <Tiptap />
                  </Flex>
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
                          className="-m-2.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                          <span className="sr-only">{t("upload_file")}</span>
                        </label>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPosting}
                    className="text-md rounded-md bg-white  px-2.5
                   pt-2 align-middle  font-semibold text-gray-900 shadow-sm ring-1
                    ring-inset ring-gray-300 hover:bg-gray-300"
                  >
                    {t("post")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* image display section */}

          {/* <div className="grid w-full h-auto rounded bg-accent text-accent-content place-content-end items-end">
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
        </div> */}
          {filesContent.length > 0 && (
            <div className="mt-3 w-full" id="uploadImageDiv" >
              <div className="dark:border-darkmode-400 rounded-md border-2 border-dashed pt-4">
                <div className="flex flex-wrap px-4">
                  {filesContent.map((file, index) => (
                    <div
                      id={"uploadImage" + index}
                      key={"uploadImage" + index}
                      className="image-fit zoom-in relative mr-5 cursor-pointer"
                    >
                      <img
                        className="max-h-[80px] rounded-md"
                        alt="Midone Tailwind HTML Admin Template"
                        src={file.content}
                      />
                      <Tippy
                        content=" "
                        aria-controls="content"
                        aria-selected="true"
                        className="bg-danger absolute right-0 top-0 -mr-2 
                                -mt-2 flex h-5 w-5 items-center 
                                justify-center rounded-full text-white"
                      >
                        <Lucide
                          icon="X"
                          onClick={() =>
                            removePictureFromUploader(
                              index,
                              "uploadImage" + index
                            )
                          }
                          className="h-6 w-6 rounded-full bg-red-500
                                 hover:bg-indigo-500"
                        />
                      </Tippy>
                    </div>
                  ))}
                </div>
                <div className="relative flex cursor-pointer items-center px-4 pb-4"></div>
              </div>
            </div>
          )}
          </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"], i18n)),
  },
});
