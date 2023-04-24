import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'chinese': [ 'Noto Sans TC','Noto Sans SC','sans-serif' ],
      },
      backgroundImage :{
        'AccountSetup': "url('https://images.unsplash.com/photo-1523705480679-b5d0cc17a656?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80')",
      }
    },
   
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
