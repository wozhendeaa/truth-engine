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
import Tippy from "components/Tippy";
import Lucide from "components/Lucide";
import CommentEditor from "components/TipTap/CommentEditor";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
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
  const [imageWidth, setImageWidth] = useState(0);

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
      const uploadImageDiv = document.getElementById("uploadImageDiv");
      if (uploadImageDiv) uploadImageDiv.innerHTML = "";
    }
  }


  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement;
    setImageWidth(target.width + 10);
  };

  return (
    <>
        <div className=" w-[100%] place-content-center">
          <Flex>
            <Box flex="none">
              <Image
                src={user.profileImageUrl ?? "/images/default_profile.png"}
                alt=""
                width={60}
                height={60}
                onLoad={handleImageLoad}
                className="flex-none shrink-0 rounded-full p-2"
              />
            </Box>
            <Box className="float-left w-full" style={{ maxWidth: `calc(100% - ${imageWidth}px)` }}>
              <CommentEditor />
            </Box>
            </Flex>
          {/* image display section */}
          {filesContent.length > 0 && (
            <div className="mt-3 w-full" id="uploadImageDiv">
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
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"], i18n)),
  },
});
