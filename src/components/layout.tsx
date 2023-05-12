import { PropsWithChildren, useEffect } from "react";
import MainNavBar from "./MainNavBar";
import TruthEngineSideBar from "./QTruthEngineSidebar";


export const PageLayout = (props: PropsWithChildren) => {

    return (
      <>
        <MainNavBar />
        <TruthEngineSideBar />
        <main className='grid grid-cols-4 dark bg-te_dark_bg min-h-screen'>
          {props.children}
        </main>
      </>
    );
  };