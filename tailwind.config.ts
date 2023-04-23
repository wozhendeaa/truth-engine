import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'chinese': [ 'Noto Sans TC','Noto Sans SC','sans-serif' ],
      },
    },
   
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
