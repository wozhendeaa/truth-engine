import { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  PuzzlePieceIcon,
  VideoCameraIcon,
  XMarkIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import UserContext from 'helpers/userContext'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const navigation = [
  { name: 'index', href: '/', icon: Cog6ToothIcon },
  { name: 'professor_videos', href: '/professor-videos', icon: VideoCameraIcon },
  { name: 'natural_healing', href: '/natural-healing', icon: PuzzlePieceIcon },
  { name: 'redpill_academy', href: '/red-pill-academy', icon: AcademicCapIcon },
  { name: 'faq', href: '/faq', icon: QuestionMarkCircleIcon },
]
const actions = [
  { id: 1, name: 'write_long_post', href: '#', initial: 'H' },
]

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ') 
}

export default function TruthEngineSideMenuBar() {
  const user = useContext(UserContext);
  const location = useRouter();

  const {t} = useTranslation();

  function isActive(path:string) {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.includes(path);
  }
  return (<>
    {/* Static sidebar for desktop */}
    <div className="hidden lg:flex col-span-2 lg:inset-y-0 lg:z-30 lg:max-w-[200px] 
    lg:flex-col mr-8 h-screen sticky pt-9">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-trasparent">
            <div className='mt-6'></div>
            <nav className="flex flex-1 flex-col ">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1 ">
                    {navigation.map((item) => (
                      <li key={item.name} >
                        <a
                          href={item.href}
                          className={classNames(
                            isActive(item.href)
                              ? 'bg-te_dark_darker  text-white '
                              : 'text-gray-400 hover:text-white rounded-lg',
                            'group flex gap-x-3 rounded-md p-2 text-xl leading-6  tracking-wider font-semibold'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {t(item.name)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {actions.map((a) => (
                      <li key={a.name}>
                        <a
                          href={a.href}
                          className={classNames(
                            'bg-gray-800 text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {a.initial}
                          </span>
                          <span className="truncate">{t(a.name)}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
           
              </ul>
            </nav>
          </div>
        </div>
        
        
        </>
  )
}
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});
