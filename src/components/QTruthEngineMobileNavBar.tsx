import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserContext from "helpers/userContext";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TE_Routes from "TE_Routes";

const navigation = [
  TE_Routes.Index,
  TE_Routes.ProfessorVideos,
  TE_Routes.NaturalHealing,
  TE_Routes.RedPillAcademy,
  TE_Routes.FAQ,
];
const actions = [{ id: 1, name: "write_long_post", href: "#", initial: "H" }];

function isActive(path: string) {
  if (path === "/") {
    return location.pathname === "/";
  }

  return location.pathname.includes(path);
}

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TruthEngineMobileNavBar() {
  const user = useContext(UserContext);
  const location = useRouter();
  const [isSSR, setIsSSR] = useState(true);

  const { t } = useTranslation();

  function isActive(path: string) {
    if (location.pathname === "/") {
      return path === "/";
    }

    return path.startsWith(location.pathname);
  }

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <>
      {/* Static nav for mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 
      inline
      h-[80px]
     w-screen
      shrink-0 border-t-gray-800 bg-transparent bg-opacity-80 
      font-chinese  backdrop-blur-md dark:bg-te_dark_bg md:hidden"
      >
        <div className="flex h-full flex-1 items-center  justify-evenly px-3">
          <div
            role="list"
            className="flex h-full w-full
            flex-row items-center justify-between
           "
          >
            {navigation.map((item) => (
              <div key={item.name}>
                <a
                  href={item.path}
                  className={classNames(
                    isActive(item.path) ? " text-indigo-400" : "",
                    "group flex gap-x-3 rounded-lg px-1 tracking-widest  text-gray-300 hover:text-white"
                  )}
                >
                  <div className="h-[60px] w-[60px] shrink ">{item.icon}</div>
                </a>
                <div
                  className={classNames(
                    isActive(item.path)
                      ? " text-indigo-400"
                      : "dark:text-slate-100",
                    "flex w-full items-center justify-evenly pl-1 "
                  )}
                >
                  {t(item.name)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});
