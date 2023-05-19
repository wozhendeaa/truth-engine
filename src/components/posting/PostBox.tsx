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
import { Box, Flex } from "@chakra-ui/react";
import UserContext from "helpers/userContext";
const i18n = require("next-i18next.config");

//create react hook validation schema for post
export const postSchema = z.object({
  content: z.string().min(1, { message: "post_too_short" }),
  media: z.string().optional(),
});

export const PostCreator = () => {
  const { mutate, isLoading: isPosting } = api.posts.createPost.useMutation();
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [creationError, setCreationError] = useState(false);

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

  function setError(err: string) {
    //todo
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
    setDisableSend: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    try {
      // const keys = await uploadToS3();
    } catch (cause) {
      setError("图片上传失败，可能是网络问题");
    }
    try {
       let result = false
      const promise = new Promise<void>((resolve) => {
        mutate(
          {
            content: JSON.stringify(editor.getJSON()),
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
              const errorMessage = e.data?.code;
              console.log(errorMessage);
              if (errorMessage) {
                toast.error(t(errorMessage));
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
      console.log(cause);
      setError("发表信息失败，可能是网络问题");
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
            style={{ maxWidth: `calc(100% - ${imageWidth}px)` }}
          >
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
