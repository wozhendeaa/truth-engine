import type { PropsWithChildren } from "react";
import MainNavBar from "./MainNavBar";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <>
        <MainNavBar  />
        <main className="flex justify-center h-screen overflow-y-scroll overscroll-y-none" >
        <div className="w-full h-full border-x md:max-w-2xl border-slate-400 dark:bg-black " >
                {props.children}
            </div>
        </main>
      </>
  )

}