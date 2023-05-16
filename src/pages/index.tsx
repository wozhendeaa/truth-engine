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
    <div>
      <div className="hidden font-chinese sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <span
                onClick={() => changeTab(tab)}
                key={tab}
                className={classNames(
                  tab == selectedTab
                    ? "w-[100%] cursor-pointer border-indigo-400 text-indigo-400 "
                    : "w-[100%] border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-700",
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

  const { t, i18n } = useTranslation(["common", "footer"], {
    bindI18n: "languageChanged loaded",
  });
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
    void i18n.reloadResources(i18n.resolvedLanguage, ["common", "footer"]);
  }, []);

  return (
    <>
      <PageLayout>
        <Flex direction="row" justifyContent={"center"}>
          <Flex className="hidden h-full md:inline"></Flex>

          <Flex className="w-[100%] md:w-[80%] xl:w-[50%]" direction="column">
            {(isVerified || (isSignedIn && tab == "COMMUNITY") )&& <PostBox />}
            {isLoading ? (
              <GetSekleton number={5} />
            ) : (
              <>
                <selectedTabContext.Provider value={{ tab, setTab }}>
                  <Tabs />
                  <Box className={tab == "VERIFIED_ENGINE" ? "" : "hidden"}>
                    {
                      //@ts-ignore
                      <FeedThread postData={data} />
                    }
                  </Box>

                  <Box className={tab == "COMMUNITY" ? "w-[100%]" : "hidden"}>
                  社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文社区贴文
                  </Box>
                  <Box className={tab == "NEWS" ? "w-[100%]" : "hidden"}>
                  机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻机器人新闻
                  </Box>
                </selectedTabContext.Provider>
              </>
            )}
          </Flex>

          <Flex className="hidden lg:inline "></Flex>
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
