import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { Descendant, createEditor } from "slate";
import { BaseEditor } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { Flex } from "@chakra-ui/react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

export type CustomEditor = BaseEditor & ReactEditor 

export type ParagraphElement = {
  type: 'paragraph'
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: number
  children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement

export type FormattedText = { text: string; bold?: true }

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

export const SlateCommentEditor = () => {
  const { t } = useTranslation();
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <>
    <Flex width={'full'}>
      <Slate editor={editor} value={initialValue}>
        <Editable />
      </Slate>
      </Flex>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});
