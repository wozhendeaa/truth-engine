import { type Config } from "tailwindcss";

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
      },
      backgroundImage :{
        'AccountSetup': "url('https://images.unsplash.com/photo-1523705480679-b5d0cc17a656?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80')",
      },
      colors: {
        te_dark_font: ' #363457',
        te_dark_bg: '#0a1537',
        te_dark_ui: '#1f294f',
        te_dark_ui_bg: '#111d45',
        te_dark_action: '#7451fe',
        te_dark_green: '#00b474',
        te_dark_green_bg: '#263d56',
        te_dark_red: '#e45a50',
        te_dark_red_bg: '#363457',
      },
    },
   
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
