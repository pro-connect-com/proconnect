// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"League Spartan"', 'sans-serif'],
      },
      colors: {
        green: {
          600: '#16a34a', // ProConnect brand green
          700: '#15803d',
        }
      }
    },
  },
  plugins: [],
}