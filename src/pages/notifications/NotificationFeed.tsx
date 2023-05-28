import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Box, Flex } from "@chakra-ui/react";
import { RouterOutputs } from "utils/api";
import { GetTime } from "helpers/UIHelper";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingSpinner } from "components/loading";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { renderAsHTML } from "components/TipTap/TruthEngineEditor";
import { TFunction } from "i18next";
import { useContext } from "react";
import UserContext from "helpers/userContext";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function renderNotification(
  notif: notificationItemType,
  receiverProfileurl: string,
  reveiverName: string,
  t: TFunction<"translation", undefined, "translation">
) {
  // console.log(notif.comment?.content);
  // console.log(notif.post?.content);
  return (
    <>
      <div>{t(notif.type.toLowerCase())}</div>
      <div>{renderAsHTML(notif.content)}</div>
      <div>
        <div className="flex flex-row rounded-lg bg-te_dark_font p-2">
          <Image
            width={20}
            height={20}
            className="rounded-full"
            src={receiverProfileurl ?? "/public/images/default_avatar.png"}
            alt=""
          />
          <div className="pl-2">{reveiverName}:</div>
          <div className="pl-2">
            <div>
              {renderAsHTML(notif.comment?.content.substring(0, 100) ?? "")}
            </div>
            {!notif.comment && (
              <div>
                {renderAsHTML(notif.post?.content.substring(0, 100) ?? "")}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

type notificationItemType =
  RouterOutputs["Notification"]["getNotificationForUser"]["notifications"][number];
export function SingleCommentLikeItem(props: { item: notificationItemType }) {
  const { item } = props;
  const { t } = useTranslation();
  const user = useContext(UserContext);

  return (
    <div className="z-30 bg-white px-4 py-5 hover:cursor-pointer dark:bg-te_dark_bg hover:dark:bg-te_dark_ui sm:px-6">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            width={40}
            height={40}
            className="rounded-full"
            src={
              item.sender.profileImageUrl ?? "/public/images/default_avatar.png"
            }
            alt=""
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            <a href="#" className="hover:underline">
              {item.sender.displayname}
            </a>
            <a href="#" className="pl-3 hover:underline ">
              {GetTime({ date: new Date(item.createdAt) })}
            </a>
          </div>
          <div className="text-sm text-gray-500 dark:text-slate-300"></div>
          <div className="text-sm font-semibold text-gray-900 hover:cursor-text dark:text-slate-100">
            {renderNotification(
              item,
              user?.profileImageUrl ?? "",
              user?.displayname ?? "",
              t
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EndingMessage(message: string) {
  return (
    <div className="z-40 rounded-md bg-te_dark_ui p-4">
      <div className="flex">
        <div className="ml-3">
          <div className="text-sm font-medium text-slate-50">{message}</div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5"></div>
        </div>
      </div>
    </div>
  );
}

type notificationType =
  RouterOutputs["Notification"]["getNotificationForUser"]["notifications"];
export interface FeedProps {
  data: notificationType | undefined;
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewFeed: () => Promise<unknown>;
}
const NotificationFeed = ({
  data,
  isError,
  isLoading,
  fetchNewFeed,
  hasMore = false,
}: FeedProps) => {
  const { t } = useTranslation();
  const notifications = data;
  if (!notifications) return <></>;
  return (
    <>
      <Flex className="flex flex-col">
        <InfiniteScroll
          className="hide-scrollbar"
          dataLength={notifications.length}
          next={fetchNewFeed}
          hasMore={hasMore}
          loader={<LoadingSpinner />}
          endMessage={EndingMessage(t("end_of_scroll"))}
        >
          {notifications.map((n) => {
            return <SingleCommentLikeItem key={n.id} item={n} />;
          })}
        </InfiniteScroll>
      </Flex>
    </>
  );
};

export const getSrverSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});

export default NotificationFeed;
