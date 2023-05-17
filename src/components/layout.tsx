import { PropsWithChildren, useEffect } from "react";
import MainNavBar from "./MainNavBar";
import TruthEngineMobileSideBar from "./QTruthEngineSidebar";


export const PageLayout = (props: PropsWithChildren) => {

    return (
      <>
        <MainNavBar />
        <TruthEngineMobileSideBar />
        <main className="dark min-h-screen w-full flex justify-center 
          bg-cover bg-center bg-fixed bg-te_dark_bg ">
      <div className="absolute inset-0 pointer-events-none bg-repeat-y blur bg-site-bg opacity-[5%]"></div>
        {props.children}
        </main>
      </>
    );
  };