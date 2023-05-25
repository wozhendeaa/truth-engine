import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import UserContext from "helpers/userContext";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HomeIcon, ProfileIcon } from "./icons/Icons";
import TE_Routes from "TE_Routes";

const navigation = [
  TE_Routes.Index,
  TE_Routes.Trending,
  TE_Routes.IndexNotification,
  TE_Routes.myProfile,
];
const actions = [{ id: 1, name: "write_long_post", href: "#", initial: "H" }];

function isActive(path: string) {
  if (path === "/") {
    return location.pathname === "/";
  }

  return location.pathname.includes(path);
}

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TruthEngineSideMenuBar() {
  const user = useContext(UserContext);
  const location = useRouter();

  const { t } = useTranslation();

  function isActive(path: string) {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.includes(path);
  }
  return (
    <>
      {/* Static sidebar for desktop */}
      <div
        className="fixed col-span-2 -ml-[5px] h-[100%] shrink-0 pt-[100px]
   sm:mr-[40px] md:-ml-[75px] md:flex lg:inset-y-0 lg:z-30 lg:ml-0 lg:flex lg:max-w-[100%] lg:flex-col"
      >
        <div className="bg-trasparent flex grow flex-col gap-y-5 overflow-y-auto px-3 lg:-ml-[200px]">
          <div className="mt-6"></div>
          <nav className="flex flex-1 flex-col ">
            <ul role="list" className="flex flex-1 flex-col gap-y-7  ">
              <li>
                <ul role="list" className="mx-0 space-y-1 md:-mx-2 ">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.path}
                        className={classNames(
                          isActive(item.path) ? "text-white" : "",
                          "group flex gap-x-3 rounded-lg p-2 text-xl font-semibold leading-6 tracking-widest  text-gray-300 hover:text-white"
                        )}
                      >
                        {item.icon}
                        <div className="hidden lg:block">{t(item.name)}</div>
                      </a>
                    </li>
                  ))}
                  <li className="-ml-[5px] md:ml-0">
                    <div className="hidden lg:block">
                      <button
                        type="button"
                        className="inline-flex w-auto items-center gap-x-2
                        rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold
                        text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <PencilIcon className=" h-5 w-5" aria-hidden="true" />
                        {t(TE_Routes.WriteLongPost.name)}
                      </button>
                    </div>
                    <div className="lg:hidden">
                      <button
                        type="button"
                        className="ml-2.5 inline-flex items-center gap-x-2 rounded-lg
                        bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white
                        shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:ml-1.5"
                      >
                        <PencilIcon
                          className="-ml-0.5 h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});
