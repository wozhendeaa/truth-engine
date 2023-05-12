import { PropsWithChildren, useEffect } from "react";
import MainNavBar from "./MainNavBar";
import { api } from "utils/api";
import { setUser } from "Redux/userSlice";
import { getMyUser, setMyUser } from "pages/helpers/userHelper";

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