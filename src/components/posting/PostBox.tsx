import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { api } from "utils/api";
import Image from "next/image";
import S3 from "aws-sdk/clients/s3";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useContext, useEffect, useState } from "react";
import TruthEngineEditor from "components/TipTap/TruthEngineEditor";
import { Box, Button, Flex } from "@chakra-ui/react";
import UserContext from "helpers/userContext";
import TE_Routes from "TE_Routes";
import { FileContent } from "use-file-picker";
import { useAppDispatch } from "Redux/hooks";
import { setErrors } from "Redux/truthEditorSlice";
import { parseErrorMsg } from "helpers/serverErrorMessage";
const i18n = require('next-i18next.config')

//create react hook validation schema for post
export const postSchema = z.object({
  content: z.string().min(1, { message: "post_too_short" }),
  media: z.string().optional(),
});

type postFormSchema = z.infer<typeof postSchema>;
export const PostCreator = () => {
  const { mutate} = api.posts.createPost.useMutation();

  const user = useContext(UserContext);
  const ctx = api.useContext();
  const {t} = useTranslation();
  const dispatch = useAppDispatch()

  const [imageWidth, setImageWidth] = useState(0);
  if (!user) return null;

  async function uploadToS3(mediaFiles:FileContent[]) {
    let keys = [];
    for (let i = 0; i < mediaFiles.length; i++) {
    
      let file = mediaFiles[i];
      if (!file) continue;
      let fileType = file.name.split(".").at(1);
      if (!fileType) continue;
      fileType = encodeURIComponent(fileType).toString();
      const apiUrl = TE_Routes.uploadPicture.path + fileType;
      const { data } = await axios.post(apiUrl);
      const { uploadUrl, key } = data;
      keys.push({ key, fileType });

      //convert base64 to blob
      const base64Str = file?.content.toString() ?? "";
      const response = await fetch(base64Str);
      const blob = await response.blob();

      await axios
        .put(uploadUrl, blob)
        .then((res) => {})
        .catch((e) => {
          setError(parseErrorMsg(e));
        });
    }

    return keys;
  }

  function setError(err: string) {
    dispatch(setErrors(err));
  }

  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    setImageWidth(target.width + 10);
  };

  //being called by the editor when uploading content
  async function OnSend(
    editor: any,
    mediaFiles:FileContent[],
    setDisableSend: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    let keys: any = undefined;
    try {
        keys = await uploadToS3(mediaFiles);

    } catch (cause) {
      setError("图片上传失败" + cause);
      return false;
    }

    try {
       let result = false
      const promise = new Promise<void>((resolve) => {
        mutate(
          {
            content: editor.getHTML(),
            media: JSON.stringify(keys)         
          },
          {
            onSuccess: () => {
              void ctx.posts.getAll.invalidate();
              editor.commands.setContent(null);
              editor.setEditable(true);
              result = true;
              resolve();
              toast(t('post_good'));
            },
            onError: (e) => {
              const errorMessage = e.message;
              if (errorMessage) {
                setError(errorMessage);
              }     
              resolve();         
            },
          }
        );
      });

      await promise;
      setDisableSend(false)
      return result;

    } catch (cause) {
      setError(cause + "");
      return false;
    } 
    
  }

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
          <Box
            className="float-left w-full"
            style={{ maxWidth: `calc(100% - ${imageWidth}px)`}}>
            <TruthEngineEditor editorType={"POST"} onSend={OnSend} />
          </Box>
        </Flex>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"], i18n)),
  },
});
