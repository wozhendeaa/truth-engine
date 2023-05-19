import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  type NextPage,
} from "next";
import { LoadingPage, LoadingSpinner } from "components/loading";
import { PageLayout } from "components/layout";
import { RouterOutputs, api } from "utils/api";
import { generateSSGHelper } from "server/helpers/ssgHelper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Avatar,
  Box,
  Card,
  Container,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Upload from "views/admin/main/profile/overview/components/Upload";
// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import { useTranslation } from "react-i18next";
import { ChangeEventHandler, createContext, useContext, useState } from "react";
import UserContext from "helpers/userContext";
import EngineFeed from "components/PostComment/EngineFeed";
import { isUserVerified } from "helpers/userHelper";
import CommentThread from "components/PostComment/CommentFeed";
import GeneralCommentThread from "components/PostComment/GeneralCommentFeed";
import { User } from "@prisma/client";


//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tabs = ["posts", "comments"] as const;
const selectedTabContext = createContext<{
  tab: (typeof tabs)[number];
  setTab: (newState: (typeof tabs)[number]) => void;
}>({
  tab: "posts",
  setTab: () => {}
});


export function Tabs() {
  const {t} = useTranslation();
  const {tab: selectedTab, setTab} = useContext(selectedTabContext);

  function changeTab(tab: (typeof tabs)[number]) {
    setTab(tab);
  }

  return (
    <div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <span
                onClick={() => changeTab(tab)}
                key={tab}
                className={classNames(
                  tab == selectedTab
                    ? 'border-indigo-400 text-indigo-400 cursor-pointer w-[100%] '
                    : 'border-transparent w-[100%] text-gray-300 hover:border-gray-300 hover:text-gray-700',
                  'w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium cursor-pointer'
                )}
                aria-current={tab == selectedTab ? 'page' : undefined}>
                <span className="text-lg">{t(tab)}</span>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}


type userWithStat = RouterOutputs["user"]["getUserWithProfileStatsByUserName"]
export function ProfileBanner(props: {user:userWithStat}) {
  const {user} = props;
  const {t} = useTranslation();

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900","white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "#111C44 !important",
    "white !important"
  );

  if (!user) return <></>;

  return (
    <Card
      mb={{ base: "0px", lg: "20px" }}
      alignItems="center"
      bgColor={"te_dark_ui_bg"}
      pb={5}
    >
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
    />
      <Avatar
        mx="auto"
        src={user.profileImageUrl ?? '/public/images/default_avatar.png'}
        h="87px"
        w="87px"
        mt="-43px"
        border="4px solid"
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {user.displayname}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        @{user.username}
      </Text>
      <Flex w="max-content" mx="auto" mt="26px">
        <Flex mx="auto" me="60px" align="center" direction="column">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
            {user._count.posts}
          </Text>
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            {t('post_num')}
          </Text>
        </Flex>
        <Flex mx="auto" me="60px" align="center" direction="column">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
          {user._count.comments}
          </Text>
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
          {t('comment_num')}
          </Text>
        </Flex>
        <Flex mx="auto" align="center" direction="column">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
             {user.NiuBi}
          </Text>
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
           {t('niub')}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export function Posts() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("white","secondaryGray.900");
  const textColorSecondary = "gray.400";
  const user = useContext(UserContext);

  const {data,  isLoading} = api.posts.getPostsByUserId.useQuery({userId: user?.id ?? ''});
  if (!user || !data) return <></>;
  return (
    <>
       {isLoading && <LoadingSpinner />}
       <Box className={true ? "" : "" }>
        <EngineFeed postData={data} />
      </Box>
    </>
  );
}
export function Comments() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const user = useContext(UserContext);

  const {data,  isLoading} = api.comment.getCommentsForUser
  .useQuery({userId: user?.id ?? ''});

  if (!user || !data) return <></>;
  return (
    <>
      {isLoading && <LoadingSpinner />}
       <Box>
          <GeneralCommentThread
            comments={data}
          />
      </Box>
    </>
  );
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.user.getUserWithProfileStatsByUserName.useQuery({
    username: username,
  });
  const [tab, setTab] = useState<(typeof tabs)[number]>("posts");

  if (!data) return <>500 错误。 用户被ban或不存在</>

  return (
    <>
      <PageLayout>
        <selectedTabContext.Provider value={{tab, setTab}}>
        <Flex pt={{ base: "80px", md: "30px", xl: "30px" }} width={"full"} columnGap={-4}>
          <Container maxW={{ base: "full", md: "70%", lg: "50%" }}>
            <VStack gap={"-40px"}>
              <Box width={'full'}>
                <ProfileBanner user={data}/>
              </Box>
              <Box width={'full'}>
                <Tabs />
              </Box>
              <Box width={'full'} className={tab == "posts" ? "" : "hidden"}>
                <Posts />
              </Box>
              <Box width={'full'} className={tab == "comments" ? "" : "hidden"}>
                <Comments />
              </Box>
            </VStack>
          </Container>
        </Flex>
        </selectedTabContext.Provider>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const locale = "zh-CN";
  const slug = context.params?.profileId as string;
  if (typeof slug !== "string") throw new Error("slug is not a string");
  const username = slug.replace("@", "");
  await ssg.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
