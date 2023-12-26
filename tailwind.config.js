/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  fontFamily: {
    sofia: ['Sofia Pro']
  },
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '6': '48px',
      },
    },
    colors: {
      'light-brown': '#d4bfa5',
      'white': '#ffffff',
      'pink-200': '#fbcfe8',
      'sky-200': '#bae6fd',
    }
  },
  plugins: [],
}
