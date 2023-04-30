import type { PropsWithChildren } from "react";
import MainNavBar from "./MainNavBar";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <>
        <MainNavBar  />
        <main className="grid grid-cols-4 dark bg-te_dark_bg min-h-screen"> 
            {props.children}
        </main>
      </>
  )

}