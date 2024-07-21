// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brod-black': '#000000',
        'brod-zinc': '#1B1B1B',
        'brod-stone': '#242220',
        'brod-slate': '#334058',
        'brod-gray': {
          400: '#948997',
          500: '#666E81',
        },
        'brod-rose': {
          500: '#F4485D',
          700: '#B5413B',
        },
        'brod-orange': '#EE9849',
        'brod-stone-50': '#FEF9F9',
      },
      fontFamily: {
        'abeezee': ['ABeeZee', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}