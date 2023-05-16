import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { TFunction } from "i18next";
import UserContext from "helpers/userContext";
import { useRouter } from "next/router";
import Link from "next/link";
import routes from "routes";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const UnLoggedInUserSection = ({
  t,
}: {
  t: TFunction<"translation">;
}) => {
  return (
    <>
      <div className="flex border-b border-slate-400 p-4">
        <SignInButton afterSignInUrl="/api/prepareNewUser">
          <button
            type="button"
            className="-mb-1  -mr-2
          -mt-1 grow rounded-lg bg-gradient-to-r from-purple-500 via-purple-600
           to-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
          >
            {t("sign_in")}
          </button>
        </SignInButton>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl={"/api/prepareNewUser"}
        />
      </div>
    </>
  );
};

export const LoggedInUserSection = ({
  isSSR,
  t,
}: {
  isSSR: boolean;
  t: TFunction<"translation">;
}) => {
  const user = useContext(UserContext);

  return (
    <>
      <div className="hidden shadow-xl md:ml-4 md:flex  md:items-center ">
        <button
          type="button"
          className="flex-shrink-0 rounded-full bg-gray-700 p-1 text-slate-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="sr-only"> {!isSSR && t("view_notifications")}</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-4 flex-shrink-0">
          <div>
            <Menu.Button
              className="hover:focus:outline-solid flex rounded-full bg-white text-sm focus:outline-none
                     focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">{!isSSR && t("open_user_menu")}</span>
              <Image
                className="rounded-full"
                width={40}
                height={40}
                src={user?.profileImageUrl ?? "/images/default_avatar.png"}
                alt=""
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href={routes.myProfile.path + user?.id!}
                    className={classNames(
                      active ? "bg-gray-100 dark:bg-purple-800" : "",
                      "block px-4 py-2 text-sm text-gray-700 dark:text-slate-300"
                    )}
                  >
                    {!isSSR && t("profile_page")}
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 dark:bg-purple-800" : "",
                      "block px-4 py-2 text-sm text-gray-700 dark:text-slate-300"
                    )}
                  >
                    {!isSSR && t("settings")}
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <SignOutButton>
                    {
                      <a
                        className={classNames(
                          active ? "bg-gray-100 dark:bg-purple-800" : "",
                          "block px-4 py-2 text-sm text-gray-700 dark:text-slate-300"
                        )}
                      >
                        {!isSSR && t("sign_out")}{" "}
                      </a>
                    }
                  </SignOutButton>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <Disclosure.Panel className="lg:hidden">
        <div className="border-t border-gray-200 pb-3 pt-4 ">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <Image
                className="rounded-full"
                width={20}
                height={20}
                src={user?.profileImageUrl ?? "/images/default-profile.png"}
                alt=""
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">#todo</div>
              <div className="text-sm font-medium text-gray-500">#todo.com</div>
            </div>
            <button
              type="button"
              className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800"
            >
              <span className="sr-only">
                {" "}
                {!isSSR && t("view_notifications")}
              </span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <Disclosure.Button
              as="a"
              href={routes.myProfile.path + user?.id!}
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              {!isSSR && t("profile_page")}
            </Disclosure.Button>
            <Disclosure.Button
              as="a"
              href="#"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              {!isSSR && t("settings")}
            </Disclosure.Button>
            <Disclosure.Button
              as="a"
              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              {!isSSR && t("sign_out")}
            </Disclosure.Button>
          </div>
        </div>
      </Disclosure.Panel>
    </>
  );
};

export default function MainNavBar() {
  const [isSSR, setIsSSR] = useState(true);
  const { isSignedIn } = useUser();
  const location = useRouter();

  function isActive(path: string) {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.includes(path);
  }

  useEffect(() => {
    setIsSSR(false);
  }, []);
  const { t } = useTranslation();

  return (
    <>
      <Disclosure
        as="nav"
        className="bg-blur sticky top-0 z-50 
  border-b-4
    border-b-gray-800 bg-white font-chinese text-4xl shadow-xl dark:bg-te_dark_ui"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 ">
              <div className="flex h-16 justify-between">
                <div className="flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href={routes.Index.path}>
                      <Image
                        className="block h-8 w-auto lg:hidden hover:cursor-pointer"
                        src="/images/QtruthEngineLogo.png"
                        width={60}
                        height={60}
                        alt="Q真相引擎"
                        priority
                      />
                    </Link>
                    <Link href={routes.Index.path}>
                      <Image
                        className="hidden h-8 w-auto lg:block hover:cursor-pointer"
                        src="/images/QtruthEngineLogo.png"
                        width={60}
                        height={60}
                        alt="Q真相引擎"
                        priority
                      />
                    </Link>
                  </div>{" "}
                  <div className="dark: hidden text-xl text-slate-300 md:ml-6 md:flex md:space-x-8 ">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                    <Link
                      href={routes.Index.path}
                      className={`font-Noto+Sans+TC inline-flex items-center px-1  pt-1 text-gray-900 hover:border-gray-300 dark:hover:text-purple-300 ${
                        isActive("/")
                          ? "border-b-2 border-indigo-500 dark:text-purple-300"
                          : "dark:text-slate-100 "
                      }`}
                    >
                      {!isSSR && t("index")}
                    </Link>
                    <Link
                      href={routes.ProfessorVideos.path}
                      className={`font-Noto+Sans+TC inline-flex items-center px-1  pt-1 text-gray-900 hover:border-gray-300 dark:hover:text-purple-300 ${
                        isActive(routes.ProfessorVideos.path)
                          ? "border-b-2 border-indigo-500 dark:text-purple-300"
                          : "dark:text-slate-100 "
                      }`}
                    >
                      {!isSSR && t("professor_videos")}
                    </Link>
                    <Link
                      href={routes.NaturalHealing.path}
                      className={`font-Noto+Sans+TC inline-flex items-center px-1  pt-1 text-gray-900 hover:border-gray-300 dark:hover:text-purple-300 ${
                        isActive(routes.NaturalHealing.path)
                          ? "border-b-2 border-indigo-500 dark:text-purple-300"
                          : "dark:text-slate-100 "
                      }`}
                    >
                      {!isSSR && t("natural_healing")}
                    </Link>
                    <Link
                      href={routes.RedPillAcademy.path}
                      className={`font-Noto+Sans+TC inline-flex items-center px-1  pt-1 text-gray-900 hover:border-gray-300 dark:hover:text-purple-300 ${
                        isActive(routes.RedPillAcademy.path)
                          ? "border-b-2 border-indigo-500 dark:text-purple-300"
                          : "dark:text-slate-100 "
                      }`}
                    >
                      {!isSSR && t("redpill_academy")}
                    </Link>
                    <Link
                      href={routes.FAQ.path}
                      className={`font-Noto+Sans+TC inline-flex items-center px-1  pt-1 text-gray-900 hover:border-gray-300 dark:hover:text-purple-300 ${
                        isActive(routes.FAQ.path)
                          ? "border-b-2 border-indigo-500 dark:text-purple-300"
                          : "dark:text-slate-100 "
                      }`}
                    >
                      {!isSSR && t("FAQ")}
                    </Link>
                  </div>
                </div>
                {/* {search} */}
                {/* <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                  {!isSSR && t('search')}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-slate-100 dark:hover:text-purple-300" aria-hidden="true" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border-0 bg-white dark:text-slate-100 dark:bg-gray-800 dark:hover:text-purple-300 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder= {!isSSR ? (t('search') + " ") : " "}
                      type="search"
                    />
                    
                  </div>

                </div>

              </div> */}

                {isSignedIn ? (
                  <LoggedInUserSection isSSR={isSSR} t={t} />
                ) : (
                  <UnLoggedInUserSection t={t} />
                )}
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
}
