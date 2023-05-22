"use client";
import {
  useEditor,
  EditorContent,
  generateHTML,
  JSONContent,
  mergeAttributes,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { HSeparator } from "components/separator/Separator";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import data from "@emoji-mart/data";
import NimblePicker from "@emoji-mart/react";
import { FileContent, FileError, FilePickerReturnTypes, SelectedFiles, useFilePicker } from "use-file-picker";
import DOMPurify from "dompurify";
import Mention from "@tiptap/extension-mention";
import CharacterCount from "@tiptap/extension-character-count";
import Tippy from "components/Tippy";
import Lucide from "components/Lucide";
import { selectTruthEditor, setErrors} from 'Redux/truthEditorSlice';
import { useDispatch, useSelector } from "react-redux";
import suggestion from './suggestion'
import UserContext from "helpers/userContext";
import { User } from "@prisma/client";
import { TFunction } from "i18next";
import { Node } from '@tiptap/core'
import { Link } from '@tiptap/extension-link'


import './styles.scss'
const truthConfig = require('truth-engine-config.js')

function isNullOrEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

const MenuBar = (props: {
  editor: any,
  picker: FilePickerReturnTypes,
  mediaFileState: any,
  sendButtonState:[boolean, React.Dispatch<React.SetStateAction<boolean>>],
  editorType: any,
  onSend: any,
}) => {
  const { editor, picker, mediaFileState, editorType, onSend } = props;
  const { t } = useTranslation();
  const [showEmoji, setShowEmoji] = useState(false);
  const iconRef = useRef<HTMLButtonElement | null>(null);
  const [mediaFiles, setMediaFiles] = mediaFileState;
  const [openFileSelector, {clear}] = picker;
  const [disableSend, setDisableSend] = props.sendButtonState;


  if (!editor) {
    return null;
  }

  const handleOnClickOutside = (event: MouseEvent) => {
    // Check if the click was on the icon that opens the picker
    //@ts-ignore
    if (iconRef.current && iconRef.current.contains(event.target as Node)) {
      // If the click was on the icon, toggle the visibility of the picker
      setShowEmoji(true);
    } else {
      // If the click was outside of the icon and the picker, hide the picker
      setShowEmoji(false);
    }
  };

  function preparedToSend() {
    if (!onSend) return false;
    if (editor.isEmpty && mediaFiles.length > 0) {
      editor.commands.insertContent(t("pics_only_default_text"));
      return true;
    } else if (isNullOrEmpty(editor.getText())) {
      return false;
    }

    setDisableSend(true);
    return true;
  }

  async function handleSend() {
    // console.log(editor.getText());

    if (preparedToSend()) {
      editor.setEditable(false);
      const result = await onSend(editor, mediaFiles, setDisableSend);
      
      if (result) {
        setMediaFiles([]);     
       } 
    }
  }

  return (
    <>
      <ul className="flex w-full flex-row justify-between gap-1 pt-2 ">
        <li className="float-left">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={
                editor.isActive("bold")
                  ? " editor-menu-button-active"
                  : "editor-menu-button"
              }
            >
              <path
                d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 
          6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"
              ></path>
            </svg>
          </button>
        </li>
        {/* italic */}
        <li className="-ml-1.5">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={
                editor.isActive("italic")
                  ? " editor-menu-button-active"
                  : "editor-menu-button"
              }
            >
              <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path>
            </svg>
          </button>
        </li>
        {/* strike  */}
        <li className="-ml-1">
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={
                editor.isActive("strike")
                  ? " editor-menu-button-active"
                  : "editor-menu-button"
              }
            >
              <path d="M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92084 6.5 9.24559 6.5 8.45207C6.5 7.21602 6.96583 6.165 7.89749 5.299C8.82916 4.43299 10.2706 4 12.2219 4C13.6934 4 15.1009 4.32808 16.4444 4.98426V7.13591C15.2448 6.44921 13.9293 6.10587 12.4978 6.10587C10.0187 6.10587 8.77917 6.88793 8.77917 8.45207C8.77917 8.87172 8.99709 9.23796 9.43293 9.55079C9.86878 9.86362 10.4066 10.1135 11.0463 10.3004C11.6665 10.4816 12.3431 10.7148 13.076 11H13.076Z"></path>
            </svg>
          </button>
        </li>
        <li
          className={
            editorType === "COMMENT" || editorType === "COMMENT_TALL"
              ? "hidden"
              : ""
          }
        >
          {/* image upload */}
          <button
            onClick={() => {
              clear();
              openFileSelector();
            }}
            className={editor.isActive("code") ? "is-active pl-1" : " pl-1"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={
                editor.isActive("code")
                  ? " editor-menu-button-active"
                  : "editor-menu-button"
              }
            >
              <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
            </svg>
          </button>
        </li>
        <li className="pl-1 hidden md:block">
          {/* emoji */}
          <button
            ref={iconRef}
            onClick={() => setShowEmoji(!showEmoji)}
            disabled={!editor.can().chain().focus().run()}
            className={editor.isActive("") ? "is-active " : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={
                showEmoji ? " editor-menu-button-active" : "editor-menu-button"
              }
            >
              <path d="M10.5199 19.8634C10.5955 18.6615 10.8833 17.5172 11.3463 16.4676C9.81124 16.3252 8.41864 15.6867 7.33309 14.7151L8.66691 13.2248C9.55217 14.0172 10.7188 14.4978 12 14.4978C12.1763 14.4978 12.3501 14.4887 12.5211 14.471C14.227 12.2169 16.8661 10.7083 19.8634 10.5199C19.1692 6.80877 15.9126 4 12 4C7.58172 4 4 7.58172 4 12C4 15.9126 6.80877 19.1692 10.5199 19.8634ZM19.0233 12.636C15.7891 13.2396 13.2396 15.7891 12.636 19.0233L19.0233 12.636ZM22 12C22 12.1677 21.9959 12.3344 21.9877 12.5L12.5 21.9877C12.3344 21.9959 12.1677 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM10 10C10 10.8284 9.32843 11.5 8.5 11.5C7.67157 11.5 7 10.8284 7 10C7 9.17157 7.67157 8.5 8.5 8.5C9.32843 8.5 10 9.17157 10 10ZM17 10C17 10.8284 16.3284 11.5 15.5 11.5C14.6716 11.5 14 10.8284 14 10C14 9.17157 14.6716 8.5 15.5 8.5C16.3284 8.5 17 9.17157 17 10Z"></path>
            </svg>
          </button>
          <Box className={"absolute z-50 "}>
            {showEmoji && (
              <NimblePicker
                locale={"zh"}
                data={data}
                onEmojiSelect={(e: any) => {
                  editor.commands.insertContent(e.native);
                }}
                onClickOutside={handleOnClickOutside}
              />
            )}
          </Box>
        </li>

        {/* send button  */}
        <li className="ml-auto pr-5">
          <button disabled={disableSend} onClick={() => handleSend()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={disableSend ? "editor-sending" : "editor-send"}
            >
              <path d="M3 13.0001H9V11.0001H3V1.8457C3 1.56956 3.22386 1.3457 3.5 1.3457C3.58425 1.3457 3.66714 1.36699 3.74096 1.4076L22.2034 11.562C22.4454 11.695 22.5337 11.9991 22.4006 12.241C22.3549 12.3241 22.2865 12.3925 22.2034 12.4382L3.74096 22.5925C3.499 22.7256 3.19497 22.6374 3.06189 22.3954C3.02129 22.3216 3 22.2387 3 22.1544V13.0001Z"></path>
            </svg>{" "}
          </button>
        </li>
      </ul>
    </>
  );
};

export function gettHtmlFromJson(json: JSONContent): string {
  const output = useMemo(() => {
    return generateHTML(json, [StarterKit]);
  }, [json]);

  return output.toString();
}

export function renderAsHTML(content: string) {
  let result: string = "";

  try {
    result = gettHtmlFromJson(JSON.parse(content));
    result = DOMPurify.sanitize(result);
  } catch (cause) {
    result = content;
  }

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: result }}></span>
    </>
  );
}

const types = ["POST", "LONG_POST", "COMMENT", "COMMENT_TALL"] as const;
type EditorType = (typeof types)[number];

interface TruthEngineEditorOnSendCallback {
  (
    editor: any,
    mediaFiles:FileContent[],//any data
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<boolean>; //return if action is successful
}

interface TruthEngineEditorOnLoadCallback {
  (editor: any): void;
}


interface TruthEngineEditorProps {
  editorType: EditorType;
  onSend: TruthEngineEditorOnSendCallback;//编辑器发送任何东西的时候会触发这个玩意儿
  onLoad?: TruthEngineEditorOnLoadCallback;//编辑器出生的时候会触发这个玩意儿
}

const wordLimit = 500;

const WordCountCircle = (props: { percentage: number }) => {
  const {percentage} = props;
  let strokeColor = "";
  if (percentage >= 90) {
    strokeColor = 'red'
  } else if (percentage >= 70) {
    strokeColor = "yellow"
  } else {
    strokeColor = "#818cf8"
  }
  return (
    <>
      <svg
        height="30"
        width="30"
        viewBox="0 0 20 20"
        className="character-count__graph pr-1"
      >
        <circle r="10" cx="10" cy="10" fill="gray"  />
        <circle
          r="5"
          cx="10"
          cy="10"
          fill="white"
          stroke={strokeColor}
          strokeWidth="10"
          strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
          transform="rotate(-90) translate(-20)"
        />
        <circle r="6" cx="10" cy="10" fill="#111d45" />
      </svg>
    </>
  );
};

function getConfigForUser(user: User | null | undefined) {
  const config = truthConfig.uploadSetting.settings;
  //@ts-ignore
  const defaultConfig = config.find((u) => u.role === 'SHEEP');

  if (!user) return defaultConfig;

  const userRole = user.role;
  //@ts-ignore
  const userConfig = config.find((u) => u.role === userRole);

  return userConfig;
}

function handleUploaderErrors(
  errors:FileError[],
  config:any,
  t: TFunction<"translation", undefined, "translation">) {
  if (errors.length && errors.length > 0) {
    if (errors[0]?.fileSizeTooSmall) {
      return t('upload_image_too_small');
    } else if (errors[0]?.fileSizeToolarge) {
      return  t('upload_image_too_big') + config.maxPictureSize + 'mb';
    } else if (errors[0]?.readerError) {
      return  t('upload_reading_error');
    } else if (errors[0]?.maxLimitExceeded) {
      return  t('too_many_files') + config.maxPictures;
    } else if (errors[0]?.imageHeightTooBig || errors[0]?.imageWidthTooBig
|| errors[0]?.imageWidthTooSmall || errors[0]?.imageHeightTooSmall ) {
      return  t('upload_wrong_dimension');
  }else if (errors[0]?.imageNotLoaded) {
    return  t('too_many_files');
  }else {
      return String(errors[0]);
    }
  }

  return null;
}

// const ReplyToUserDiv = Node.create({
//   name: 'ReplyToUserDiv',
//   group: 'block',
//   content: 'inline*',
//   atom: true,
//   reactive: true,
//   attrs: {
//     displayName: { default: '' },
//     username: { default: '' },
//   },
//   parseHTML() {
//     return [
//       {
//         tag: 'div.reply-to-user',
//       },
//     ];
//   },
//   renderHTML({ node, HTMLAttributes }) {
//     const displayName = node.attrs.displayName;
//     const username = node.attrs.username;
//     return [
//       'div', 
//       mergeAttributes(HTMLAttributes, { class: 'text-sky-400 reply-to-user' }),
//       [
//         'span',
//         { class: 'bg-slate-200' },
//         displayName,
//       ],
//       [
//         'a',
//         { href: `#${username}`, class: 'text-indigo-400 hover:underline' },
//         username,
//       ],
//     ];
//   },
//   addCommands() {
//     return {
//       insertStyledDiv: attrs => ({ commands }) => {
//         return commands.insertContent({
//           type: this.name,
//           attrs: attrs,
//         });
//       },
//     };
//   },
// });


const TruthEngineEditor: React.FC<TruthEngineEditorProps> = ({
  editorType,
  onSend,
  onLoad,
}) => {
  const { t } = useTranslation();
  const mediaFileState = useState<FileContent[]>([]);
  const [mediaFiles, setMediaFiles] = mediaFileState;
  const errors = useSelector(selectTruthEditor);
  const user = useContext(UserContext);
  const uploadConfig = getConfigForUser(user);
  const dispatch = useDispatch();
  const sendButtonState = useState(true);
  const [disableSend, setDisableSend] = sendButtonState;

  const filePicker = useFilePicker({
    readAs: "DataURL",
    accept: uploadConfig.acceptType,
    multiple: true,
    limitFilesConfig: { max: uploadConfig.maxPictures },
    maxFileSize: uploadConfig.maxPictureSize,
    imageSizeRestrictions: {
      maxHeight: 1920, // in pixels
      maxWidth: 1080,
      minHeight: 100,
      minWidth: 200,
    },
    onFilesSuccessfulySelected: (data: SelectedFiles) => {
      setMediaFiles((prev) => {
        const unique = data.filesContent.filter((newFile) => {
          return !mediaFiles.some((existingFile) => newFile.name === existingFile.name);
        });
        return prev.concat(unique);
      });
    },
  });

  const [
    openFileSelector,
    {errors: pickerError, clear },
  ] = filePicker;
  const uploadError = handleUploaderErrors(pickerError, uploadConfig, t);

  
  const editor = useEditor({
    onUpdate({ editor }) {
      const disableSendButton = isNullOrEmpty(editor.getText())
      setDisableSend(disableSendButton);
    },
    onFocus({ editor, event }) {
      //清空错误信息
      clear();
      dispatch(setErrors(null));
    },
    editorProps: {
      attributes: {
        class:
          getMinHeightForEditor() +
          " prose font-chinese text-2xl prose-sm sm:prose lg:prose-lg xl:prose-2xl px-2 pt-2 mx-auto min-h-[100px] focus:outline-none",
      },
    },
    extensions: [
      Link,
      // ReplyToUserDiv,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Placeholder.configure({
        placeholder: getPlaceHolderForEditor(),
      }),      
      Mention.configure({
        HTMLAttributes: {
          class: "text-red-400 bg-te_dark_ui rounded-lg",
        },
        renderLabel({ options, node }) {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`;
        },
        suggestion: suggestion
      }),
      CharacterCount.configure({
        limit: wordLimit,
      }),
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: null,
  });


  function removePictureFromUploader(name_id: string) {
    let copy = mediaFiles.filter((file) => file.name !== name_id);
    setMediaFiles(copy);
  }


  function getPlaceHolderForEditor() {
    if (editorType === "POST") {
      return t("post_place_holder").toString();
    } else if (editorType === "COMMENT") {
      return t("comment_place_holder").toString();
    } else if (editorType === "LONG_POST") {
      return t("long_post_place_holder").toString();
    }
    return "";
  }

  function getMinHeightForEditor() {
    if (editorType === "POST") {
      return "min-h-[100px]";
    } else if (editorType === "COMMENT") {
      return "min-h-[20px]";
    } else if (editorType === "COMMENT_TALL") {
      return "min-h-[100px]";
    } else if (editorType === "LONG_POST") {
      return "min-h-full";
    }
    return "";
  }

  if (onLoad) {
    onLoad(editor);
  }

  // useEffect(() => {
  //   if (editor) {
  //     editor.commands.insertStyledDiv({
  //       displayName: '回复',
  //       username: '网军账号',
  //     });
  //   }
  // }, [editor]);

  if (!editor) return <></>;

  let newPercentage = (editor.storage.characterCount.characters() / wordLimit) * 100.0;
  return (
    <>
      <Flex direction="column" className="w-[100%]">
        <Flex>
          <EditorContent
            editor={editor}
            className="w-[100%] pr-2 text-slate-50"
          />
        </Flex>
        <Flex className="items-end justify-end pr-6 font-chinese">
          <WordCountCircle percentage={newPercentage} />
          {editor.storage.characterCount.characters()}/{wordLimit}
          {editor.storage.characterCount.characters() === wordLimit && (
            <span className=" ml-3 text-red-300">{t("try_long_post")}</span>
          )}
        </Flex>
        <Flex className="flex w-[100%] flex-wrap pr-4">
          {/* image display section */}
          {mediaFiles.length > 0 && (
            <div className="mt-3 w-full" id="uploadImageDiv">
              <div className="dark:border-darkmode-400 rounded-md border-2 border-dashed py-2">
                <div className="flex flex-wrap px-4">
                  {mediaFiles.map((file, index) => (
                    <div
                      id={file.name}
                      key={file.name}
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
                          onClick={() => removePictureFromUploader(file.name)}
                          className="h-6 w-6 rounded-full bg-red-500
                                 hover:bg-indigo-500"
                        />
                      </Tippy>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <HSeparator my={1} />
          <MenuBar
            editor={editor}
            picker={filePicker}
            mediaFileState={mediaFileState}
            editorType={editorType}
            sendButtonState={sendButtonState}
            onSend={onSend}
          />
        </Flex>
        <Flex>
          {errors && <span className="text-red-500 bg-red-100 
          rounded-md font-chinese p-2">{errors}</span>}
          {uploadError && <span className="text-red-500 bg-red-100 
          rounded-md font-chinese p-2">{uploadError}</span>}
        </Flex>
      </Flex>
    </>
  );
};

export default TruthEngineEditor;

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});

////paste event for images
// paste (view, event) {
//   const hasFiles =
//       event.clipboardData &&
//       event.clipboardData.files &&
//       event.clipboardData.files.length

//   if (!hasFiles) return

//   const images = Array.from(event.clipboardData.files).filter(file => /image/i.test(file.type))
//   if (images.length === 0) return

//   event.preventDefault()
//   event.stopImmediatePropagation()

//   images.forEach(image => {
//       const reader = new FileReader()

//       reader.onload = readerEvent => {
//           const options = {
//               src: readerEvent.target.result
//           }

//           if (isRetina) {
//               const dimensions = getRetinaDimensions(options.src.substring(options.src.indexOf(',') + 1))
//               if (dimensions) {
//                   options.width = dimensions.width
//               }
//           }

//           // Do what you want here.
//       }
//       reader.readAsDataURL(image)
//   })
// }