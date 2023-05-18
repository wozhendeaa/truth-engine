import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { PostCreator as PostBox } from "components/posting/PostBox";
import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

import FeedThread from "components/PostComment/FeedThread";
import { api } from "utils/api";
import UserContext from "../helpers/userContext";
import { GetSekleton } from "../helpers/UIHelper";
import { isUserSignedIn, isUserVerified } from "helpers/userHelper";
import { Provider } from "react-redux";
import { HSeparator, VSeparator } from "components/separator/Separator";
import TruthEngineSideMenuBar from "components/QTruthEngineSideMenubar";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = ["VERIFIED_ENGINE", "COMMUNITY", "NEWS"] as const;
const selectedTabContext = createContext<{
  tab: (typeof tabs)[number];
  setTab: (newState: (typeof tabs)[number]) => void;
}>({
  tab: "VERIFIED_ENGINE",
  setTab: () => {},
});

export function Tabs() {
  const { t } = useTranslation();
  const { tab: selectedTab, setTab } = useContext(selectedTabContext);

  function changeTab(tab: (typeof tabs)[number]) {
    console.log(tab);
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

const Home: NextPage = () => {
  const { data: verifiedFeed, isLoading: isVerifiedLoading } =
    api.posts.getVerifiedEngineFeed.useQuery();

  const { data: communityFeed, isLoading: isCommunityLoading } =
    api.posts.getCommunityEngineFeed.useQuery();

  const user = useContext(UserContext);
  const [tab, setTab] = useState<(typeof tabs)[number]>("VERIFIED_ENGINE");

  const isVerified = isUserVerified(user);
  const isSignedIn = isUserSignedIn(user);

  const { t } = useTranslation();

  function isAnyTabLoading() {
    if (tab == "VERIFIED_ENGINE") {
      return isVerifiedLoading;
    } else if (tab == "COMMUNITY") {
      return isCommunityLoading;
    } else if (tab == "NEWS") {
      return false;
    }

    return false;
  }

  function isCurrentTabLoading(currTab: (typeof tabs)[number]) {
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
      <PageLayout>
        <Flex className="hidden sm:block">
          {!isAnyTabLoading() && (
            <>
              <TruthEngineSideMenuBar />
            </>
          )}
        </Flex>

        <Flex
          className="w-[100%] md:w-[80%] lg:w-[60%] xl:w-[50%]"
          direction="column"
        >
          {isCurrentTabLoading("VERIFIED_ENGINE") ? (
            <GetSekleton number={5} />
          ) : (
            <>
              <selectedTabContext.Provider value={{ tab, setTab }}>
                <Tabs />
                <Box>
                  <Box
                    className={
                      isVerified && tab == "VERIFIED_ENGINE" ? "" : "hidden"
                    }
                  >
                    <PostBox />
                    <Box>
                      <HSeparator className="mt-2" />
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box className={tab == "VERIFIED_ENGINE" ? "" : "hidden"}>
                    {
                      //@ts-ignore
                      <FeedThread postData={verifiedFeed} />
                    }
                  </Box>
                </Box>

                <Flex direction={"column"}>
                  <Box className={tab == "COMMUNITY" ? "" : " hidden "}>
                    <Flex>
                      <PostBox />
                    </Flex>
                    <Flex>
                      <HSeparator className="mt-2" />
                    </Flex>
                    <Flex>
                      {
                        //@ts-ignore
                        <FeedThread postData={communityFeed} />
                      }
                    </Flex>
                  </Box>
                </Flex>
                <Box className="w-full">
                  <Box className={tab == "NEWS" ? "" : "hidden"}>
                    机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻
                  </Box>
                </Box>
              </selectedTabContext.Provider>
            </>
          )}
        </Flex>

        <Flex className="hidden lg:block ">
          {!isAnyTabLoading() && (
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
