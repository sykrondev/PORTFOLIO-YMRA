/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070d1a',
          900: '#0b1530',
          800: '#10204a',
          700: '#16306a',
          600: '#1d4296',
        },
        graphite: {
          900: '#161a22',
          700: '#3a4150',
          500: '#5a6473',
          300: '#9aa3b2',
        },
        gold: {
          700: '#a17a23',
          600: '#c89b3c',
          500: '#d9b25b',
          400: '#e6c478',
        },
        exec: {
          blue: '#1f6feb',
          green: '#1f9d55',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(7,13,26,0.35)',
        soft: '0 10px 30px -10px rgba(7,13,26,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [],
};
