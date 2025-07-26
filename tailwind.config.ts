import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earth to Digital Transition Theme
        earth: {
          soil: "#5D3A00",
          wheat: "#F9D342", 
          grass: "#8BC34A",
        },
        transition: {
          light: "#F5F5F5",
          steel: "#B0BEC5",
          blue: "#42A5F5",
        },
        tech: {
          midnight: "#0A192F",
          neon: "#64FFDA",
          cyan: "#00BCD4",
        },
        aviation: {
          blue: "#1976D2",
          gold: "#FFD700",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(100, 255, 218, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(100, 255, 218, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
