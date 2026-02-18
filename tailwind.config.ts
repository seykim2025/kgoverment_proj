import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "system-ui", "sans-serif"],
      },
      colors: {
        // Toss-style Blue (Primary)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3182F6', // Main Brand Color
          600: '#1B64DA', // Hover
          700: '#1957C2', // Active
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Semantic Colors
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#30B566',
          700: '#1E8E4E',
        },
        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          500: '#F59E0B',
          700: '#B45309',
        },
        danger: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          500: '#F04452',
          700: '#C41C1C',
        },
        // Neutrals
        gray: {
          50: '#F7F8FA',
          100: '#F2F3F6',
          200: '#EAEBEE',
          300: '#DCDEE3',
          400: '#D1D3D8',
          500: '#AEB0B6',
          600: '#868B94',
          700: '#4E5968',
          800: '#333D4B',
          900: '#191F28',
        }
      },
      boxShadow: {
        'toss-sm': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'toss-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'toss-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'toss-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
