import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { Box, Flex } from "@chakra-ui/react";

import {
  CodeBracketIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  StarIcon,
} from "@heroicons/react/20/solid";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function SingleItem() {
  return (
    <div className="z-30 bg-white px-4 py-5 hover:cursor-pointer dark:bg-te_dark_bg hover:dark:bg-te_dark_ui sm:px-6">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            <a href="#" className="hover:underline">
              Chelsea Hagon
            </a>
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-300">
            <a href="#" className="hover:underline">
              December 9 at 11:43 AM
            </a>
          </p>
          <p className="text-sm font-semibold text-gray-900 hover:cursor-text dark:text-slate-100">
            Chelsea HagonChelsea HagonChelsea HagonChelsea HagonChelsea
            HagonChelsea HagonChelsea HagonChelsea HagonChelsea HagonChelsea
            HagonChelsea HagonChelsea HagonChelsea HagonChelsea HagonChelsea
            HagonChelsea HagonChelsea HagonChelsea HagonChelsea HagonChelsea
            HagonChelsea HagonChelsea Hagon
          </p>
        </div>
      </div>
    </div>
  );
}

const NotificationFeed = () => {
  return (
    <>
      <Flex className="flex flex-col">
        <SingleItem />
        <SingleItem />
        <SingleItem />
        <SingleItem />
        <SingleItem />
      </Flex>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});

export default NotificationFeed;
