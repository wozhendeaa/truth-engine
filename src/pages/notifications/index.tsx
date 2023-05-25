import { type NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex } from "@chakra-ui/react";
import EngineFeed from "components/PostComment/EngineFeed";
import { api } from "utils/api";
import { isUserVerified } from "helpers/userHelper";
import { HSeparator, VSeparator } from "components/separator/Separator";
import UserContext from "helpers/userContext";
import { GetSekleton } from "helpers/UIHelper";

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


const HomeNotification: NextPage = () => {
  const [tab, setTab] = useState<(typeof tabs)[number]>("COMMENTS_LIKES");

  const engineFeedQuery = api.posts.getVerifiedEngineFeed.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: tab == "COMMENTS_LIKES"
  });

  const communityFeedQuery = api.posts.getCommunityEngineFeed.useInfiniteQuery({limit:1}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: tab == "ENGINE_UPDATES"
  });

  const { isLoading: isVerifiedLoading } = engineFeedQuery;
  const {isLoading: isCommunityLoading } = communityFeedQuery
  
  const user = useContext(UserContext);
  const { t } = useTranslation();
    function isAnyTabLoading() {
    if (tab == "COMMENTS_LIKES") {
      return isVerifiedLoading;
    } else if (tab == "ENGINE_UPDATES") {
      return isCommunityLoading;
    }
    return false;
  }

  function isCurrentTabLoading(currTab: (typeof tabs)[number]) {
    if (currTab == "COMMENTS_LIKES") {
      return isVerifiedLoading;
    } else if (currTab == "ENGINE_UPDATES") {
      return isCommunityLoading;
    }

    return false;
  }

  return (
    <>
        <Flex>
          {isCurrentTabLoading("COMMENTS_LIKES") ? (
            <GetSekleton number={5} />
          ) : (
            <>
              <selectedTabContext.Provider value={{ tab, setTab }}>
                <Tabs />
                <Box>
                  <div className={tab == "COMMENTS_LIKES" ? "" : "hidden" } >
                    {
                      //@ts-ignore
                      <EngineFeed posts={engineFeedQuery.data?.pages.flatMap((page) => page.posts)} 
                      fetchNewFeed={engineFeedQuery.fetchNextPage}
                      hasMore={engineFeedQuery.hasNextPage}
                      isLoading={engineFeedQuery.isLoading}
                       />
                    }
                  </div>
                </Box>

                <Flex direction={"column"}>
                  <Box className={tab == "ENGINE_UPDATES" ? "" : " hidden "}>
                    <Flex>
                      <HSeparator className="mt-2" />
                    </Flex>
                    <Flex>
                      {
                      //@ts-ignore
                      <EngineFeed posts={communityFeedQuery.data?.pages.flatMap((page) => page.posts)} 
                      fetchNewFeed={communityFeedQuery.fetchNextPage}
                      hasMore={communityFeedQuery.hasNextPage}
                      isLoading={communityFeedQuery.isLoading}
                       />
                      }
                    </Flex>
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
