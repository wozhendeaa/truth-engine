import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex justify-center h-screen" >
        <div className="w-full h-full border-x md:max-w-2xl border-slate-400 overflow-y-scroll">
                {props.children}
            </div>
        </main>
  )

}