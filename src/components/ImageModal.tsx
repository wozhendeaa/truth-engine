import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { LoadingSpinner } from './loading';


export default function ImageModal(props:  {url: string, open: boolean, close: () => void}) {
  const { url, open, close } = props;
  const [isImageReady, setIsImageReady] = useState(false);

  return (
<Transition.Root show={open} as={Fragment}>
  <Dialog as="div" className="relative z-10 dark" onClose={close}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-slate-700  bg-opacity-75 transition-opacity" />
    </Transition.Child>

    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center
       p-4 text-center sm:items-center sm:p-0">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
        <Dialog.Panel className="relative transform overflow-hidden min-h-full 
          rounded-lg bg-white bg-opacity-0 px-4 pb-4 pt-5 text-left shadow-xl 
          transition-all sm:my-8 w-full sm:w-3/4 lg:w-3/4 xl:w-3/4 sm:p-6">
            <div className='flex flex-col h-full justify-center'>  
              {!isImageReady && <LoadingSpinner />}
              <Image 
                src={url}
                onLoadingComplete={() => setIsImageReady(true)}
                height={800}
                width={1600}
                alt=''   
                loading='eager'          
              />
            </div>
            <button
                onClick={close}
                className="absolute top-4 right-4 p-1 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              </button>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition.Root>



  )
}
