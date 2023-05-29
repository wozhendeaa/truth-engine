import { PropsWithChildren, useEffect } from "react";
import MainNavBar from "./MainNavBar";
import TruthEngineMobileSideBar from "./QTruthEngineSideNavbar";
import TruthEngineMobileNavBar from "./QTruthEngineMobileNavBar";

const i18n = require("next-i18next.config");

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <MainNavBar />
      <TruthEngineMobileNavBar />
      <main className="hide-scrollbar dark relative flex h-[100%] min-h-screen w-full justify-center bg-te_dark_bg">
        <div className="pointer-events-none absolute inset-0 z-0 bg-site-bg bg-cover bg-fixed bg-center bg-repeat-y opacity-[5%]"></div>
        {props.children}
      </main>
    </>
  );
};
