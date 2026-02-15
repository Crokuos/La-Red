/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './pages/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'red-accent': 'var(--color-red-accent)',
        'red-dark': 'var(--color-red-dark)',
        'red-gold': 'var(--color-red-gold)'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      backgroundImage: {
        'club-gradient': 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 60%)',
        'glow-accent': 'radial-gradient(closest-side, rgba(139,92,246,0.15), transparent)'
      }
    }
  },
  safelist: [
    'bg-red-accent',
    'bg-red-accent/5',
    'bg-red-accent/10',
    'bg-red-accent/20',
    'bg-red-accent/40',
    'text-red-accent',
    'border-red-accent',
    'from-red-accent',
    'to-red-accent'
  ],
  plugins: []
};
