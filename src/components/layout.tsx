import type { PropsWithChildren } from "react";
import MainNavBar from "./MainNavBar";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import AdminPage from "pages/admin";

export const PageLayout = (props: PropsWithChildren) => {
    return (
      <>
        <MainNavBar />
                <main className='grid grid-cols-4 dark bg-te_dark_bg min-h-screen'>
                  {props.children}
                </main>
      </>
    );
  };