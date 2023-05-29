import { useUser } from "@clerk/nextjs";
import { FlagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { api } from "utils/api";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import toast from "react-hot-toast";
import ReportModal from "./reportModal";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface ReportType {
  reportType: string;
  reportMessage: string;
}

export default function CommentActionMenu(props: {
  commentId: string;
  canDeleteOrEdit: boolean;
}) {
  const { commentId, canDeleteOrEdit } = props;
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const ctx = api.useContext();
  const { mutate } = api.report.reportComment.useMutation();
  const [reportType, setReportType] = useState<ReportType>({
    reportType: "SPAM",
    reportMessage: "",
  });
  const [open, setOpen] = useState(false);

  function Report() {
    if (!isSignedIn) {
      toast.error("login_before_report");
      return false;
    }

    try {
      console.log(commentId);
      mutate(
        {
          content: "",
          commentId: commentId,
          type: "SCAM",
        },
        {
          onSuccess: () => {
            toast.success(t("report_good"));
          },
          onError: (e) => {
            toast.error(t(e.message));
          },
        }
      );
    } catch (cause) {
      console.log(cause);
      //@ts-ignore
      toast.error(t("report_failed") + cause.message);
    }
  }
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            as="div"
            className="dark flex cursor-pointer
         items-center bg-transparent text-gray-100 hover:text-gray-600
          focus:outline-none focus:ring-2
           focus:ring-indigo-500 focus:ring-offset-2
            focus:ring-offset-gray-100"
          >
            <IoEllipsisHorizontal
              className="h-10 w-10 p-2"
              name="feedMenu"
              aria-hidden="true"
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
          <Menu.Items
            className="absolute right-0 
        z-50 mt-2 w-[100px] 
         flex-grow origin-top-right 
          bg-te_dark_ui shadow-whiteGlow ring-1
           ring-white ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => {
                      setOpen(true);
                    }}
                    className={classNames(
                      active ? "bg-indigo-500 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    <div className="pointer-events-none flex text-slate-100">
                      <FlagIcon className="h-5 w-5" />
                      <div className="text-sl pl-2">{t("report")}</div>
                    </div>
                  </a>
                )}
              </Menu.Item>
              {/* {canDeleteOrEdit &&
             <Menu.Item> 
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-indigo-500 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  <div className="flex text-slate-100 pointer-events-none">
                    <TrashIcon  className="w-5 h-5" />
                    <div className="pl-2">{t('delete')}</div>
                  </div>
                </a>
              )}
            </Menu.Item>} */}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <ReportModal
        //@ts-expect-error
        name="feedMenu"
        setReportState={setReportType}
        send={Report}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
