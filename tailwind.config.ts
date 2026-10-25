import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ocean: '#102C38', jade: '#137B6C', pearl: '#F7F8F5', mint: '#E1F2E9', gold: '#C99B59'
      },
      fontFamily: { sans: ['Inter', 'Arial', 'sans-serif'] }
    }
  },
  plugins: []
};
export default config;
