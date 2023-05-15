import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'
const i18n = require('next-i18next.config');

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const toolbarOptions = {
  container: [
    ['bold', 'italic', 'underline', 'strike'],
    ['emoji'],   
  ],
  handlers: {'emoji': function() {}}
}

const modules = {

}
const formats = ['font', 'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'color', 'background', 'list', 'indent', 'align', 'link', 'image', 'clean', 'emoji']

export const CommentEditor = () => {
  const { t } = useTranslation();
  const [editorContent, setEditorContent] = useState('');

  return (
    <>
    <Flex width={'100%'}>
      <ReactQuill 
          theme="snow"
          className="bg-te_dark_ui text-slate-100 w-full flex flex-col-reverse"
          value={editorContent} onChange={setEditorContent} 
          modules={modules}
          formats={formats}
      />
    </Flex>
    </>
  );
};


export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'], i18n)),
  },
});
