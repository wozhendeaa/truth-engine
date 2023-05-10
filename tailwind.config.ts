import plugin,{ type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontFamily: {
        'chinese': [ 'Noto Sans TC','Noto Sans SC','sans-serif' ],
        roboto: ["Roboto"],
      },
      backgroundImage :{
        'AccountSetup': "url('https://images.unsplash.com/photo-1523705480679-b5d0cc17a656?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80')",
      },
      container: {
        center: true,
      },
          maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
      colors: {
        te_dark_font: ' #363457',
        te_dark_bg: '#0a1537',
        te_dark_ui: '#1f294f',
        te_dark_darker: '#1b244a',
        te_dark_ui_bg: '#111d45',
        te_dark_action: '#7451fe',
        te_dark_green: '#00b474',
        te_dark_green_bg: '#263d56',
        te_dark_red: '#e45a50',
        te_dark_red_bg: '#363457',
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        pending: "rgb(var(--color-pending) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
        dark: "rgb(var(--color-dark) / <alpha-value>)",
        darkmode: {
          50: "rgb(var(--color-darkmode-50) / <alpha-value>)",
          100: "rgb(var(--color-darkmode-100) / <alpha-value>)",
          200: "rgb(var(--color-darkmode-200) / <alpha-value>)",
          300: "rgb(var(--color-darkmode-300) / <alpha-value>)",
          400: "rgb(var(--color-darkmode-400) / <alpha-value>)",
          500: "rgb(var(--color-darkmode-500) / <alpha-value>)",
          600: "rgb(var(--color-darkmode-600) / <alpha-value>)",
          700: "rgb(var(--color-darkmode-700) / <alpha-value>)",
          800: "rgb(var(--color-darkmode-800) / <alpha-value>)",
          900: "rgb(var(--color-darkmode-900) / <alpha-value>)",
        },
      },
    },
   
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
