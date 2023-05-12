import { PropsWithChildren, useEffect } from "react";
import MainNavBar from "./MainNavBar";
import { useUser } from "@clerk/nextjs";
import { useAppDispatch } from "Redux/hooks";
import { api } from "utils/api";
import { setUser } from "Redux/userSlice";

export const PageLayout = (props: PropsWithChildren) => {
  const {isSignedIn} = useUser();
  const { data: currentUser } = api.user.getCurrentLoggedInUser.useQuery();
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isSignedIn) {
      dispatch(setUser(currentUser!));
    }
  }, [isSignedIn, currentUser, dispatch]);
  
    return (
      <>
        <MainNavBar />
                <main className='grid grid-cols-4 dark bg-te_dark_bg min-h-screen'>
                  {props.children}
                </main>
      </>
    );
  };