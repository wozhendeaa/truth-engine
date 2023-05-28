import { GetStaticPaths, GetStaticProps, type NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { api } from "utils/api";

import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { generateSSGHelper } from "server/helpers/ssgHelper";
import { SelectedCategoryState, useFaqStore } from "zustand/FAQStore";
import { LoadingSpinner } from "components/loading";
import {
  renderAsHTML,
  renderAsHTMLWithoutSanitization,
  renderHTMLForFAQ,
} from "components/TipTap/TruthEngineEditor";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const tabs = [
  { name: "My Account", href: "#", current: false },
  { name: "Company", href: "#", current: false },
  { name: "Team Members", href: "#", current: true },
  { name: "Billing", href: "#", current: false },
];
export function Tabs() {
  const { t } = useTranslation();

  const { currSelected, changeTab, tabs } = useFaqStore(
    (state: SelectedCategoryState) => ({
      currSelected: state.currentlySelected,
      changeTab: state.changeTab,
      tabs: state.tabs,
    })
  );

  <div>
    <div className="hidden sm:block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <span
            onClick={() => changeTab(tab)}
            key={tab}
            className={classNames(
              tab == currSelected
                ? "w-[100%] cursor-pointer border-indigo-400 text-indigo-400 "
                : "w-[100%] border-transparent text-gray-300 hover:border-gray-300 hover:bg-te_dark_font",
              "w-1/4 cursor-pointer border-b-2 px-1 py-4 text-center text-sm font-medium"
            )}
            aria-current={tab == currSelected ? "page" : undefined}
          >
            <span className="text-lg">{t(tab)}</span>
          </span>
        ))}
      </nav>
    </div>
  </div>;
  return (
    <div className="hidden font-chinese sm:block">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <span
            key={tab}
            onClick={() => changeTab(tab)}
            className={classNames(
              tab == currSelected
                ? "cursor-pointer border-indigo-400 bg-gray-100 text-gray-700 dark:bg-te_dark_ui dark:text-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-slate-300",
              "cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-te_dark_ui"
            )}
            aria-current={tab == currSelected ? "page" : undefined}
          >
            <span className="text-lg">{t(tab)}</span>
          </span>
        ))}
      </nav>
    </div>
  );
}

const FAQ: NextPage = () => {
  const { t, i18n } = useTranslation(["common", "footer"], {
    bindI18n: "languageChanged loaded",
  });
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
    void i18n.reloadResources(i18n.resolvedLanguage, ["common", "footer"]);
  }, []);

  const { data: faqs, isLoading } = api.faq.getFAQ.useQuery();
  const { currSelected } = useFaqStore((state: SelectedCategoryState) => ({
    currSelected: state.currentlySelected,
  }));

  return (
    <>
      <PageLayout>
        <div className="z-10 w-full bg-te_dark_bg">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-4xl divide-y divide-white/10">
              <h2 className="text-2xl font-bold leading-10 tracking-tight text-white">
                {t("faq_title")}
                <Tabs />
              </h2>
              <dl className="mt-3 space-y-6 divide-y divide-white/10">
                {isLoading && (
                  <div className="flex h-10 w-full items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
                {!isLoading &&
                  faqs
                    ?.filter((item) => item.category?.title === currSelected)
                    .map((faq) => (
                      <Disclosure as="div" key={faq.title} className="pt-6 ">
                        {({ open }) => (
                          <>
                            <dt>
                              <Disclosure.Button className="flex w-full items-start justify-between text-left text-white">
                                <span className="text-base font-semibold leading-7">
                                  {faq.title}
                                </span>
                                <span className="ml-6 flex h-7 items-center">
                                  {open ? (
                                    <MinusSmallIcon
                                      className="h-6 w-6"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusSmallIcon
                                      className="h-6 w-6"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </dt>
                            <Disclosure.Panel as="dd" className="mt-2 pr-12">
                              <p className="text-base leading-7 text-gray-300 ">
                                {renderHTMLForFAQ(faq.answer)}
                              </p>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
              </dl>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({
  locale = "zh-CN",
}: {
  locale?: string;
}) => {
  const ssg = generateSSGHelper();
  await ssg.faq.getFAQ.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
};

export default FAQ;
