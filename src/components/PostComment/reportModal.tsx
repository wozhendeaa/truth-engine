import { useTranslation } from "react-i18next";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { url } from "inspector";

interface ReportType {
  reportType: string;
  reportMessage: string;
}

export default function ReportModal(props: {
  setReportState: Dispatch<SetStateAction<ReportType>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  send: () => void;
}) {
  const { t } = useTranslation();
  const { setReportState, setOpen, open, send } = props;
  const [selectedOption, setSelectedOption] = useState("SPAM");

  function onChange(type:string) {
    setSelectedOption(type);
    setReportState({reportType: type, reportMessage: ""});
  }

  function getSelectedBgColor(isSelected: boolean) {
    return isSelected ? " bg-indigo-500" : ""
  }
  
  return (
    <>
     <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
       <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden  rounded-lg bg-te_dark_ui_bg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
             <div className={"form-control "  +  getSelectedBgColor(selectedOption === "SPAM")}>
            <label className="label cursor-pointer">
            <span className="label-text text-slate-100">{t('report_spam')}</span>
            <input
                type="radio"
                name="radio-10"
                onChange={()=>{onChange("SPAM")}}
                className={"radio checked:bg-indigo-500"}
                checked={selectedOption === "SPAM"}
            />
            </label>
            </div>
            <div className={"form-control "  +  getSelectedBgColor(selectedOption === "PORN_VOILENCE")}>
            <label className="label cursor-pointer">
            <span className="label-text text-slate-100">{t('report_PORN_VIOLENCE')}</span>
            <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-indigo-500" 
                onChange={()=>{onChange("PORN_VOILENCE")}}
                checked={selectedOption === "PORN_VOILENCE"}
            />
            </label>
            </div>
            <div className={"form-control "  +  getSelectedBgColor(selectedOption === "FRUAD")}>
            <label className="label cursor-pointer">
            <span className="label-text text-slate-100">{t('report_FRUAD')}</span>
            <input
                type="radio"
                name="radio-10"
                className={"radio checked:bg-indigo-500" }
                onChange={()=>{onChange("FRUAD")}}
                checked={selectedOption === "FRUAD"}

            />
            </label>
            </div>
            <div className={"form-control "  +  getSelectedBgColor(selectedOption === "EMARMY")}>
            <label className="label cursor-pointer">
            <span className="label-text text-slate-100">{t('report_EARMY')}</span>
            <input
                type="radio"
                name="radio-10"
                className={"radio checked:bg-indigo-500"}
                onChange={()=>{onChange("EMARMY")}}
                checked={selectedOption === "EMARMY"}
            />
            </label>
            </div>
            <div className={"form-control "  +  getSelectedBgColor(selectedOption === "OTHER")}>
            <label className="label cursor-pointer">
            <span className="label-text text-slate-100">{t('report_OTHER')}</span>
            <input
                type="radio"
                name="radio-10"
                className={"radio checked:bg-indigo-500"}
                onChange={()=>{onChange("OTHER")}}
                checked={selectedOption === "OTHER"}
            />
            </label>
            </div>
            <div className="mt-5 sm:mt-6 flex flex-row justify-center space-x-3">
                <div className="flex">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                   {t('close')}
                  </button>
                </div>
                <div className="flex ">
                <button
                    type="button"
                    className="inline-flex w-full  justify-center  rounded-md bg-red-600 px-7 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {setOpen(false); send()}}
                  >
                   {t('report')}
                  </button>
                </div>
                
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  );
}
