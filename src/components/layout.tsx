import { PropsWithChildren, useEffect } from "react";
import MainNavBar from "./MainNavBar";
import TruthEngineMobileSideBar from "./QTruthEngineSideNavbar";


export const PageLayout = (props: PropsWithChildren) => {

    return (
      <>
        <MainNavBar />
        <TruthEngineMobileSideBar />
        <main className="dark min-h-screen w-full flex justify-center bg-te_dark_bg relative">
      <div className="absolute inset-0 pointer-events-none bg-repeat-y bg-site-bg bg-cover bg-fixed bg-center opacity-[5%] z-0"></div>
      {props.children}
    </main>

      </>
    );
  };