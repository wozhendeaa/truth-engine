import type { PropsWithChildren } from "react";
import MainNavBar from "./MainNavBar";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <>
        <MainNavBar  />
        <main className="grid grid-cols-4 dark bg-violet-900 min-h-screen"> 
            {props.children}
        </main>
      </>
  )

}