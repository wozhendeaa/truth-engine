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
    setTab(tab);
  }

  return (
    <div className="sticky top-[68px] z-50 backdrop-blur-md
    bg-opacity-80  bg-te_dark_bg">
      <div className="font-chinese sm:bloc">
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
  const { data, isLoading } =
    api.posts.getAllWithReactionsDataForUser.useQuery();
  const user = useContext(UserContext);
  const [tab, setTab] = useState<(typeof tabs)[number]>("VERIFIED_ENGINE");

  const isVerified = isUserVerified(user);
  const isSignedIn = isUserSignedIn(user);

  const { t } = useTranslation();

  return (
    <>
      <PageLayout>
        <Flex direction="row" justifyContent={"center"}>
          <Flex className="hidden sm:block">          
            {!isLoading && (<><TruthEngineSideMenuBar /></>)}
          </Flex>

        <Flex className="w-[100%] md:w-[80%] lg:w-[50%] min-w-[100%] md:min-w-[80%]
          xl:min-w-[50%]" direction="column">
            {isLoading ? (
              <GetSekleton number={5} />
            ) : (
              <>
                <selectedTabContext.Provider value={{ tab, setTab }}>
                  <Tabs  />
                  <Box>
                    <Box className={(isVerified || (isSignedIn && tab == "COMMUNITY")) ? "" : "hidden"}>
                      <PostBox />
                      <Box><HSeparator className="mt-2" /></Box>
                      </Box>
                    </Box>
                  <Box>
                    <Box className={tab == "VERIFIED_ENGINE" ? "" : "opacity-0"}>

                      {
                        //@ts-ignore
                        <FeedThread postData={data} />
                      }
                    </Box>
                  </Box>

                  <Box>
                    <Box className={tab == "COMMUNITY" ? "" : "opacity-0"}>
                    社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文
                    </Box>
                  </Box>
                  <Box >
                    <Box className={tab == "NEWS" ? "" : "opacity-0"}>
                    机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻
                    </Box>
                  </Box>
                </selectedTabContext.Provider>
              </>
            )}
          </Flex>

          <Flex className="hidden lg:block ">
          {!isLoading && (<><VSeparator mr={1} /></>)}
         
          </Flex>
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
