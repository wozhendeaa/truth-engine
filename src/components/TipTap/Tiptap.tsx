"use client";

import { useEditor, EditorContent, generateHTML, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import React, { useMemo } from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { HSeparator } from "components/separator/Separator";

//@ts-ignore
const MenuBar = ({ editor }) => {
  const { t } = useTranslation();

  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "editor-menu-button-active is-active"
            : "editor-menu-button"
        }
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "editor-menu-button-active is-active "
            : "editor-menu-button"
        }
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "editor-menu-button-active is-active "
            : "editor-menu-button"
        }
      >
        strike
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "editor-menu-button-active is-active "
            : "editor-menu-button"
        }
      >
        h1
      </button>

      <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" })
            ? "editor-menu-button-active is-active "
            : "editor-menu-button"
        }
      >
        purple
      </button>
      <button
        type="button"
        disabled={false}
        onClick={() => {}}
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

    </>
  );
};

export interface EmojiExtensionOptions {
  smileyFace: string;
}

const EmojiExtention = Extension.create<EmojiExtensionOptions>({
  name: "emoji",
  addStorage() {
    return {
      smileyFace: ":)",
    };
  },
});

export function gettHtmlFromJson(json: JSONContent) {
  const output = useMemo(() => {
    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
    ])
  }, [json])

  return (
    <>
      {output}
    </>
  )
}

const Tiptap = () => {
  const editor = useEditor({    
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl px-2 mx-auto min-h-[100px] focus:outline-none',        
      },      
    },
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      //@ts-ignore
      TextStyle.configure({ types: [ListItem.name] }),
      EmojiExtention,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        
      }),
    ],    
    content: "<p>Hello World! 🌎️</p>",
  });

  return (
    <>
      <Flex direction="column" className="w-[100%]">
        <Flex>
          <EditorContent editor={editor} className="w-[100%] text-slate-50" />
        </Flex>
        <Flex className="w-[100%] flex flex-wrap">
          <HSeparator my={1} />
          <MenuBar editor={editor} />
        </Flex>
      </Flex>
    </>
  );
};

export default Tiptap;
