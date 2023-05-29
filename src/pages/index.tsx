import { type NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { PostCreator as PostBox } from "components/posting/PostBox";
import { Box, Flex } from "@chakra-ui/react";

import EngineFeed from "components/PostComment/EngineFeed";
import { api } from "utils/api";
import UserContext from "../helpers/userContext";
import { GetSekleton } from "../helpers/UIHelper";
import { isUserVerified } from "helpers/userHelper";
import { HSeparator, VSeparator } from "components/separator/Separator";
import TruthEngineSideMenuBar from "components/QTruthEngineSideMenubar";
import HomeNotification from "./notifications";
import { useAppSelector } from "Redux/hooks";
import { selectHomePageState } from "Redux/homePageSlice";
import { SelectedCategoryState, Tab } from "zustand/EngineFeedTabsStore";
import { useEngineFeedTabsStore } from "zustand/EngineFeedTabsStore";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs() {
  const { t } = useTranslation();
  const { selectedTab, tabs, changeTab } = useEngineFeedTabsStore(
    (state: SelectedCategoryState) => ({
      selectedTab: state.currentlySelected,
      tabs: state.tabs,
      changeTab: state.changeTab,
    })
  );

  return (
    <div
      className="sticky top-0 z-30 bg-te_dark_bg bg-opacity-80
    backdrop-blur-md  md:top-[68px]"
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

const HomeMiddleContent = () => {
  const { selectedTab } = useEngineFeedTabsStore(
    (state: SelectedCategoryState) => ({
      selectedTab: state.currentlySelected,
    })
  );

  const engineFeedQuery = api.posts.getVerifiedEngineFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: selectedTab == "VERIFIED_ENGINE",
    }
  );

  const communityFeedQuery = api.posts.getCommunityEngineFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: selectedTab == "COMMUNITY",
    }
  );

  const newsFeedQuery = api.posts.getNewsEngineFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: selectedTab == "NEWS",
    }
  );

  const { isLoading: isVerifiedLoading } = engineFeedQuery;
  const { isLoading: isCommunityLoading } = communityFeedQuery;
  const { isLoading: isNewsLoading } = newsFeedQuery;

  const user = useContext(UserContext);
  const { t } = useTranslation();

  const isVerified = isUserVerified(user);

  function isCurrentTabLoading(currTab: Tab) {
    if (currTab == "VERIFIED_ENGINE") {
      return isVerifiedLoading;
    } else if (currTab == "COMMUNITY") {
      return isCommunityLoading;
    } else if (currTab == "NEWS") {
      return false;
    }

    return false;
  }

  return (
    <>
      {isCurrentTabLoading("VERIFIED_ENGINE") ? (
        <GetSekleton number={5} />
      ) : (
        <>
          <Tabs />
          <Box>
            <Box
              className={
                isVerified && selectedTab == "VERIFIED_ENGINE" ? "" : "hidden"
              }
            >
              <PostBox />
              <Box>
                <HSeparator className="mt-2" />
              </Box>
            </Box>
          </Box>
          <Box>
            <div className={selectedTab == "VERIFIED_ENGINE" ? "" : "hidden"}>
              {
                <EngineFeed
                  posts={engineFeedQuery.data?.pages.flatMap(
                    (page) => page.posts
                  )}
                  fetchNewFeed={engineFeedQuery.fetchNextPage}
                  hasMore={engineFeedQuery.hasNextPage}
                  isLoading={engineFeedQuery.isLoading}
                  isError={engineFeedQuery.isError}
                />
              }
            </div>
          </Box>

          <Flex direction={"column"}>
            <Box className={selectedTab == "COMMUNITY" ? "" : " hidden "}>
              <Flex>
                <PostBox />
              </Flex>
              <Flex>
                <HSeparator className="mt-2" />
              </Flex>
              <Flex>
                {
                  <EngineFeed
                    posts={communityFeedQuery.data?.pages.flatMap(
                      (page) => page.posts
                    )}
                    fetchNewFeed={communityFeedQuery.fetchNextPage}
                    hasMore={communityFeedQuery.hasNextPage}
                    isLoading={communityFeedQuery.isLoading}
                    isError={communityFeedQuery.isError}
                  />
                }
              </Flex>
            </Box>
          </Flex>
          <Box className="w-full">
            <Box className={selectedTab == "NEWS" ? "" : "hidden"}>
              {
                <EngineFeed
                  posts={newsFeedQuery.data?.pages.flatMap(
                    (page) => page.posts
                  )}
                  fetchNewFeed={newsFeedQuery.fetchNextPage}
                  hasMore={newsFeedQuery.hasNextPage}
                  isLoading={newsFeedQuery.isLoading}
                  isError={newsFeedQuery.isError}
                />
              }
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

interface TabLoadingState {
  loadingState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Home: NextPage = () => {
  const tabLoadingState = useState<boolean>(false);
  const [isAnyTabLoading, setIsAnyTabLoading] = tabLoadingState;
  const pageState = useAppSelector(selectHomePageState);

  return (
    <>
      <PageLayout>
        {/* 页面左边 */}
        <Flex className="hidden h-[100%] min-h-screen sm:block">
          {!isAnyTabLoading && (
            <>
              <TruthEngineSideMenuBar />
            </>
          )}
          <VSeparator />
        </Flex>
        {/* 页面中间 */}
        <Flex
          className="-mr-1 w-[100%] pl-[65px] md:float-right md:mr-0 md:w-[80%] md:pl-0  lg:w-[50%] "
          direction="column"
        >
          <div className={pageState === "FEED" ? "" : "hidden"}>
            <HomeMiddleContent />
          </div>
          <div className={pageState === "NOTIFICATION" ? "" : "hidden"}>
            <HomeNotification />
          </div>
        </Flex>
        {/* 页面右边 */}
        <Flex className="hidden lg:block">
          {!isAnyTabLoading && (
            <>
              <VSeparator mr={1} />
            </>
          )}
        </Flex>
      </PageLayout>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});

export default Home;
