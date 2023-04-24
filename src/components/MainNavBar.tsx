/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from "react-i18next";
import Image from "next/image"
import { useEffect, useState } from 'react'
import { SignIn, SignInButton, SignOutButton,  useUser } from '@clerk/nextjs';
import { TFunction } from 'i18next';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export const UnLoggedInUserSection = ({t} :{ t: TFunction<"translation">}) => {
    return <>
     <div className="flex border-b border-slate-400 p-4">
         <SignInButton afterSignInUrl="/api/prepareNewUser">
         <button type="button" className="text-white bg-gradient-to-r
          from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
           focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center -mr-2 -mb-1 -mt-1 grow">
         {t('sign_in')}</button>
         </SignInButton>
         </div>
    </>
}

export const LoggedInUserSection = ({isSSR, t} : {isSSR: boolean, t: TFunction<"translation">}) => {
  return <>
    <div className="hidden lg:ml-4 lg:flex lg:items-center ">
                <button
                  type="button"
                  className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only"> {!isSSR && t('view_notifications')}</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">{!isSSR && t('open_user_menu')}</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                              {!isSSR && t('profile_page')}
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            {!isSSR && t('settings')}
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                           <SignOutButton>
                            {<a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                              {!isSSR && t('sign_out')} </a>}
                            </SignOutButton>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
              >
                {!isSSR && t('professor_videos')}

              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                {!isSSR && t('natural_healing')}

              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
               {!isSSR && t('redpill_academy')}
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
             {!isSSR && t('discussion')}
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">#todo</div>
                  <div className="text-sm font-medium text-gray-500">#todo.com</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only"> {!isSSR && t('view_notifications')}</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  {!isSSR && t('profile_page')}
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                 {!isSSR && t('settings')}
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                {!isSSR && t('sign_out')}
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
  </>
}

export default function MainNavBar() {
    const [isSSR, setIsSSR] = useState(true);
    const {isLoaded: userLoaded, isSignedIn} = useUser();

    useEffect(() => {
        setIsSSR(false);
    }, []);
  const {t} = useTranslation();
    //return empty div if nothing is loaded
  if (!userLoaded ) return <div></div>;
  return (
    <>

    <Disclosure as="nav" className="bg-white shadow sticky top-0 font-chinese"  >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8" >
            <div className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-8 w-auto lg:hidden"
                    src="/images/QtruthEngineLogo.png"
                    width={60}
                    height={60}
                    alt="Q真相引擎"
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block"
                    src="/images/QtruthEngineLogo.png"
                    width={60}
                    height={60}
                    alt="Q真相引擎"
                  />
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8 ">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="#"
                    className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900 font-Noto+Sans+TC"
                  >
                    { !isSSR && t('professor_videos')}
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                   {!isSSR && t('natural_healing')}
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    {!isSSR && t('redpill_academy')}
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                 {!isSSR && t('discussion')}
                  </a>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                  {!isSSR && t('search')}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder= {!isSSR ? (t('search') + " ") : " "}
                      type="search"
                    />
                    
                  </div>

                </div>

              </div>

              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 
                 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>

              </div>
             {isSignedIn ? <LoggedInUserSection isSSR={isSSR} t={t} /> : <UnLoggedInUserSection t={t} />}
            </div>

          </div>

        </>
      )}
    </Disclosure>
    </>
  )
}
