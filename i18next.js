import i18next from "i18next";

module.exports = {
    locales: ['zh-CN', 'zh-TW'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'zh-CN',
    pages: {
      '*': ['common'], // Namespaces that you want to import per page (we stick to one namespace for all the application in this tutorial)
    },
  };
  
  export default i18next;