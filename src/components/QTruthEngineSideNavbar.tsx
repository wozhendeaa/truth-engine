import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
  XMarkIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import UserContext from "helpers/userContext";
import { useRouter } from "next/router";

const navigation = [
  { name: "index", href: "/", icon: Cog6ToothIcon },
  {
    name: "professor_videos",
    href: "/professor-videos",
    icon: VideoCameraIcon,
  },
  { name: "natural_healing", href: "/natural-healing", icon: PuzzlePieceIcon },
  { name: "redpill_academy", href: "/red-pill-academy", icon: AcademicCapIcon },
  { name: "faq", href: "/faq", icon: QuestionMarkCircleIcon },
];
const teams = [
  { id: 1, name: "感兴趣的话题", href: "#", initial: "H", current: false },
  { id: 2, name: "跟踪时间线", href: "#", initial: "T", current: false },
  { id: 3, name: "", href: "#", initial: "W", current: false },
];

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TruthEngineMobileSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 col-span-2 lg:hidden "
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-3">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col  items-center gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 pt-10 ring-1 ring-white/10">
                  <a href="#">
                    <span className="sr-only">Your profile</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-800"
                      src={
                        user?.profileImageUrl ?? "/images/default_avatar.png"
                      }
                      alt=""
                    />
                  </a>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 gap-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={classNames(
                                  isActive(item.href)
                                    ? "bg-gray-800 text-lg text-indigo-400"
                                    : "text-lg text-gray-200 hover:bg-gray-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {t(item.name)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-md font-semibold leading-6 text-gray-100">
                          {t("private_engine")}
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {teams.map((team) => (
                            <li key={team.name}>
                              <a
                                href={team.href}
                                className={classNames(
                                  team.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-lg font-semibold leading-6"
                                )}
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                  {team.initial}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
