/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        koklo: {
          green: "#1B6B3A", // vert profond — primaire
          "green-light": "#4CAF50", // vert clair — secondaire
          orange: "#F9A826", // orange dynamique — accent CTA
          yellow: "#FFD54F", // jaune doux — accent secondaire
          cream: "#FDF9F0", // beige crème — fond
          gray: "#F5F2EB", // gris clair — cartes / surfaces
          ink: "#2D2A24", // noir/brun — texte
        },
      },
      fontFamily: {
        display: ["'Nunito Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(45,42,36,0.10)",
        "card-hover": "0 12px 28px -6px rgba(27,107,58,0.22)",
        nav: "0 -4px 20px -6px rgba(45,42,36,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "toast-in": {
          "0%": { transform: "translateX(120%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(249,168,38,0.45)" },
          "100%": { boxShadow: "0 0 0 12px rgba(249,168,38,0)" },
        },
        "bounce-badge": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.35)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.35s cubic-bezier(.22,1,.36,1)",
        "pop-in": "pop-in 0.28s cubic-bezier(.22,1,.36,1)",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0,0,0.2,1) infinite",
        "bounce-badge": "bounce-badge 0.4s ease",
        "slide-up": "slide-up 0.4s cubic-bezier(.22,1,.36,1) both",
        shimmer: "shimmer 1.4s infinite linear",
      },
    },
  },
  plugins: [],
};
