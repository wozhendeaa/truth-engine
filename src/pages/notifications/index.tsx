import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex } from "@chakra-ui/react";
import { api } from "utils/api";
import UserContext from "helpers/userContext";
import { GetSekleton } from "helpers/UIHelper";
import NotificationFeed from "./NotificationFeed";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = ["COMMENTS_LIKES", "ENGINE_UPDATES"] as const;
const selectedTabContext = createContext<{
  tab: (typeof tabs)[number];
  setTab: (newState: (typeof tabs)[number]) => void;
}>({
  tab: "COMMENTS_LIKES",
  setTab: () => {},
});

export function Tabs() {
  const { t } = useTranslation();
  const { tab: selectedTab, setTab } = useContext(selectedTabContext);

  function changeTab(tab: (typeof tabs)[number]) {
    setTab(tab);
  }

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
  const [tab, setTab] = useState<(typeof tabs)[number]>("COMMENTS_LIKES");

  const notificationFeedQuery =
    api.Notification.getNotificationForUser.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: tab == "COMMENTS_LIKES",
      }
    );

  const updateFeedQuery =
    api.Notification.getNotificationForUser.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: tab == "ENGINE_UPDATES",
      }
    );

  const { isLoading: isNotificationLoading } = notificationFeedQuery;
  const { isLoading: isUpdateNotificationLoading } = updateFeedQuery;

  const user = useContext(UserContext);
  const { t } = useTranslation();

  function isAnyTabLoading() {
    if (tab == "COMMENTS_LIKES") {
      return isNotificationLoading;
    } else if (tab == "ENGINE_UPDATES") {
      return isUpdateNotificationLoading;
    }
    return false;
  }

  function isCurrentTabLoading(currTab: (typeof tabs)[number]) {
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
            <selectedTabContext.Provider value={{ tab, setTab }}>
              <Tabs />
              <Box>
                <div className={tab == "COMMENTS_LIKES" ? "" : "hidden"}>
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
                <Box className={tab == "ENGINE_UPDATES" ? "" : " hidden "}>
                  {/* <Flex>{<NotificationFeed />}</Flex> */}
                </Box>
              </Flex>
            </selectedTabContext.Provider>
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
