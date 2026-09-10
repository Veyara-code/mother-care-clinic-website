/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff5f7',
          100: '#ffe3ea',
          200: '#ffc9d8',
          300: '#ffa3bd',
          400: '#ff7a9c',
          500: '#f4557a',
          600: '#db3a62',
          700: '#b82a4e',
          800: '#972442',
          900: '#7d2139',
        },
        teal: {
          50: '#f0fbfa',
          100: '#d7f5f2',
          200: '#b0ebe6',
          300: '#7ddcd6',
          400: '#48c4be',
          500: '#2aa7a2',
          600: '#1f8783',
          700: '#1c6c69',
          800: '#1a5754',
          900: '#174846',
        },
        cream: '#fdf8f3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s ease-out both',
        softPulse: 'softPulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
