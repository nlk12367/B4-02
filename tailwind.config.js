/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-primary-fixed-variant": "#5b003b",
        "on-background": "#2c2f31",
        "primary-fixed": "#f673b7",
        "on-tertiary-fixed-variant": "#41208e",
        "on-primary-container": "#4a002f",
        "primary-container": "#f673b7",
        "inverse-on-surface": "#9a9d9f",
        "surface-variant": "#d9dde0",
        "error": "#b41340",
        "on-error-container": "#510017",
        "outline-variant": "#abadaf",
        "on-tertiary": "#f7f0ff",
        "tertiary": "#6448b2",
        "surface": "#f5f7f9",
        "surface-dim": "#d0d5d8",
        "surface-container-highest": "#d9dde0",
        "tertiary-container": "#baa3ff",
        "background": "#f5f7f9",
        "surface-container-high": "#dfe3e6",
        "inverse-primary": "#f673b7",
        "tertiary-fixed-dim": "#ad92ff",
        "inverse-surface": "#0b0f10",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed": "#003563",
        "secondary": "#005da7",
        "surface-tint": "#a02d70",
        "on-secondary-container": "#004884",
        "tertiary-dim": "#583ba5",
        "secondary-fixed-dim": "#9fc6ff",
        "outline": "#747779",
        "on-secondary": "#eef3ff",
        "secondary-fixed": "#b7d3ff",
        "on-tertiary-fixed": "#1d0054",
        "surface-container-low": "#eef1f3",
        "on-secondary-fixed-variant": "#005294",
        "on-primary-fixed": "#000000",
        "primary-fixed-dim": "#e666aa",
        "tertiary-fixed": "#baa3ff",
        "on-tertiary-container": "#381485",
        "on-error": "#ffefef",
        "secondary-dim": "#005192",
        "error-container": "#f74b6d",
        "on-primary": "#ffeff3",
        "on-surface": "#2c2f31",
        "on-surface-variant": "#595c5e",
        "surface-bright": "#f5f7f9",
        "primary-dim": "#912063",
        "primary": "#a02d70",
        "surface-container": "#e5e9eb",
        "error-dim": "#a70138",
        "secondary-container": "#b7d3ff"
      },
      "borderRadius": {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      "fontFamily": {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"]
      },
      "animation": {
        'chat-bubble': 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite'
      },
      "keyframes": {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      }
    }
  },
  plugins: [],
}
