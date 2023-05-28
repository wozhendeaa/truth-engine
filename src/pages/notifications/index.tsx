import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex } from "@chakra-ui/react";
import { api } from "utils/api";
import { GetSekleton } from "helpers/UIHelper";
import NotificationFeed from "./NotificationFeed";
import {
  Tab,
  TabState,
  useNotifTabsStore,
} from "zustand/NotificationTabsStore";
import UserContext from "helpers/userContext";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs() {
  const { t } = useTranslation();
  const { selectedTab, tabs, changeTab } = useNotifTabsStore(
    (state: TabState) => ({
      selectedTab: state.currentlySelected,
      tabs: state.tabs,
      changeTab: state.changeTab,
    })
  );

  return (
    <div
      className="sticky top-[68px] z-40 bg-te_dark_bg
    bg-opacity-80  backdrop-blur-md"
    >
      <div className="sm:bloc font-chinese">
        <div className="border-b border-gray-200 ">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <span
                onClick={() => changeTab(tab)}
                key={tab}
                className={classNames(
                  tab == selectedTab
                    ? "w-[100%] cursor-pointer border-indigo-400 text-indigo-400 "
                    : "w-[100%] border-transparent text-gray-300 hover:border-gray-300 hover:bg-te_dark_font",
                  "w-1/4 cursor-pointer border-b-2 px-1 py-4 text-center text-sm font-medium"
                )}
                aria-current={tab == selectedTab ? "page" : undefined}
              >
                <span className="text-lg">{t(tab)}</span>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

const HomeNotification = () => {
  const { selectedTab } = useNotifTabsStore((state: TabState) => ({
    selectedTab: state.currentlySelected,
  }));

  const notificationFeedQuery =
    api.Notification.getNotificationForUser.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: selectedTab == "COMMENTS_LIKES",
      }
    );

  const updateFeedQuery =
    api.Notification.getNotificationForUser.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: selectedTab == "ENGINE_UPDATES",
      }
    );

  const { isLoading: isNotificationLoading } = notificationFeedQuery;
  const { isLoading: isUpdateNotificationLoading } = updateFeedQuery;

  const user = useContext(UserContext);
  const { t } = useTranslation();

  function isAnyTabLoading() {
    if (selectedTab == "COMMENTS_LIKES") {
      return isNotificationLoading;
    } else if (selectedTab == "ENGINE_UPDATES") {
      return isUpdateNotificationLoading;
    }
    return false;
  }

  function isCurrentTabLoading(currTab: Tab) {
    if (currTab == "COMMENTS_LIKES") {
      return isNotificationLoading;
    } else if (currTab == "ENGINE_UPDATES") {
      return isUpdateNotificationLoading;
    }

    return false;
  }

  return (
    <>
      <Flex className="flex flex-col">
        {isCurrentTabLoading("COMMENTS_LIKES") ? (
          <GetSekleton number={5} />
        ) : (
          <>
            <Tabs />
            <Box>
              <div className={selectedTab == "COMMENTS_LIKES" ? "" : "hidden"}>
                {
                  <NotificationFeed
                    data={notificationFeedQuery.data?.pages.flatMap(
                      (page) => page.notifications
                    )}
                    fetchNewFeed={notificationFeedQuery.fetchNextPage}
                    hasMore={notificationFeedQuery.hasNextPage}
                    isLoading={notificationFeedQuery.isLoading}
                    isError={notificationFeedQuery.isError}
                  />
                }
              </div>
            </Box>

            <Flex direction={"column"}>
              <Box
                className={selectedTab == "ENGINE_UPDATES" ? "" : " hidden "}
              >
                {/* <Flex>{<NotificationFeed />}</Flex> */}
              </Box>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});

export default HomeNotification;
