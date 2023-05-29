// pages/prepare-new-user.tsx
import { GetServerSideProps, NextPage, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getAuth } from "@clerk/nextjs/server";
import { UserResource } from "@clerk/types";
import { useTranslation } from "react-i18next";
import { Switch } from "@headlessui/react";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import { prisma } from "server/db";
import { useUser } from "@clerk/nextjs";
import TE_Routes from "TE_Routes";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parse } from "url";
import { api } from "utils/api";
import { useProfileStore } from "zustand/ProfileEditStore";
import { User } from "@prisma/client";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const accountSetupSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, "username_hint")
    .min(8, "username_error_length")
    .max(20, "username_error_length"),

  userId: z.string(),

  profileImageUrl: z.string().min(10).default("/images/default_avatar.png"),

  displayName: z
    .string()
    .min(2, "displayname_error_length")
    .max(20, "displayname_error_length"),

  email: z.string().email({ message: "email_hint" }),
  receiveNotification: z.boolean().default(true),
});

export type AccountSetupSchema = z.infer<typeof accountSetupSchema>;

export function AccountSetupSection(props: { user: UserResource }) {
  const { t } = useTranslation();
  const { user } = props;

  const {
    register,
    control,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountSetupSchema>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      displayName: user.lastName + "" + user.firstName,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      profileImageUrl: user.profileImageUrl ?? "",
      username: user.username ?? "",
    },
  });
  const [profileUrl, setProfileUrl] = useState(user.profileImageUrl);

  const onSubmit: SubmitHandler<AccountSetupSchema> = async (data) => {
    axios
      .post(TE_Routes.Register.path, data)
      .then(function (response) {
        localStorage.removeItem("user");
        window.location.href = TE_Routes.Index.path;
      })
      .catch(function (e) {
        const errors = e.response.data.errors;
        console.log(errors);
        if (errors.username) {
          setError("username", {
            type: "custom",
            message: errors.username,
          });
        } else if (errors.email) {
          setError("email", {
            type: "custom",
            message: errors.email,
          });
        } else {
          console.log(e.response.data);
          toast.error(e.message);
        }
      });
  };

  const onError = async (errors: FieldErrors) => {};

  return (
    <section className="isolate grow overflow-hidden bg-white px-6 dark:bg-te_dark_bg lg:px-8">
      <div className="relative mx-auto max-w-2xl py-24 sm:py-32 lg:max-w-4xl">
        <div className="absolute left-1/2 top-0 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,theme(colors.indigo.100),white)] opacity-20 lg:left-36" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:bg-te_dark_ui sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center" />
        <figure className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-10">
          <div className="relative col-span-2 font-chinese lg:col-start-1 lg:row-start-2">
            <svg
              viewBox="0 0 162 128"
              fill="none"
              aria-hidden="true"
              className="absolute -top-12 left-0 -z-10 h-32 stroke-gray-900/10"
            >
              <path
                id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
              />
              <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
            </svg>

            <form
              className="space-y-0 pt-8"
              action={TE_Routes.Register.path}
              method="post"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Controller
                name="userId"
                control={control}
                defaultValue={user.id}
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <div className="flex items-center">
                <div className="flex-grow ">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-100"
                  >
                    {t("username")}
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder={t("username_hint").toString()}
                    {...register("username")}
                    disabled={isSubmitting}
                    className="input-bordered input-primary input mt-1 w-full max-w-xs bg-te_dark_darker text-slate-950 placeholder:text-slate-400 dark:text-slate-100"
                  />
                  {errors.username && (
                    <span className="ml-2 text-sm text-red-500">
                      {t(String(errors.username.message))}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-grow pt-1">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-100"
                  >
                    {t("displayname")}
                  </label>
                  <input
                    {...register("displayName")}
                    disabled={isSubmitting}
                    type="text"
                    id="displayName"
                    placeholder={t("displayname_hint").toString()}
                    className="input-bordered input-primary input mt-1 w-full max-w-xs bg-te_dark_darker
                     text-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                  {errors.displayName && (
                    <span className="ml-2 text-sm text-red-500">
                      {t(String(errors.displayName.message))}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-grow">
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-100"
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    disabled={isSubmitting}
                    id="emailAddress"
                    className="input-bordered input-primary input mt-1 w-full max-w-xs bg-te_dark_darker text-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                  {errors.email && (
                    <span className="ml-2 text-sm text-red-500">
                      {t(String(errors.email.message))}
                    </span>
                  )}{" "}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-grow">
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-100"
                  >
                    {t("profile_image_url")}
                  </label>
                  <input
                    type="text"
                    {...register("profileImageUrl")}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    disabled={isSubmitting}
                    id="profileImageUrl"
                    className="input-bordered input-primary input mt-1 w-full max-w-xs bg-te_dark_darker text-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />
                  {errors.profileImageUrl && (
                    <span className="ml-2 text-sm text-red-500">
                      {t("profile_image_url_null")}
                    </span>
                  )}{" "}
                </div>
              </div>

              {/* <div className="flex w-[20rem] items-center">
                <Controller
                  name="receiveNotification"
                  control={control}
                  defaultValue={true}
                  render={({ field: { onChange, value } }) => (
                    <Switch.Group
                      as="div"
                      className="flex grow items-center justify-between "
                    >
                      <span className="flex flex-grow flex-col">
                        <Switch.Label
                          as="span"
                          className="text-sm font-medium leading-6 text-gray-900"
                          passive
                        >
                          {t("receive_notification")}
                        </Switch.Label>
                        <Switch.Description
                          as="span"
                          className="text-sm text-gray-500"
                        >
                          {t("receive_notification_desc")}
                        </Switch.Description>
                      </span>
                      <Switch
                        checked={Boolean(value)}
                        onChange={onChange}
                        className={`${
                          value ? "bg-indigo-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            value ? "translate-x-5" : "translate-x-0"
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </Switch.Group>
                  )}
                />
              </div> */}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className=" rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold 
  text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {t("save_changes")}
                </button>
              </div>
            </form>
          </div>
          <div className="relative col-end-1 mt-0 w-16 lg:row-span-4 lg:w-72">
            <img
              className="rounded-xl bg-indigo-50 lg:rounded-3xl"
              src={profileUrl ?? ""}
              alt=""
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

const PrepareNewUser: NextPage = () => {
  const { user: clerkUser } = useUser();

  if (!clerkUser) {
    return null;
  }

  return (
    <>
      {clerkUser && (
        <div className="flex min-h-screen w-full items-center justify-center bg-te_dark_darker ">
          <AccountSetupSection user={clerkUser} />
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { res, req, locale } = ctx;
  const user = getAuth(req);
  const { query } = parse(req.url ?? "", true);

  const exist = await prisma.user.findFirst({
    select: {
      id: true,
    },
    where: {
      id: user.userId ?? "",
    },
  });

  if (exist) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale?.toString() ?? "ch-ZH", [
        "common",
        "footer",
      ])),
    },
  };
};

export default PrepareNewUser;
