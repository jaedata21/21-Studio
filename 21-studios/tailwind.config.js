/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void:      '#050505',
        obsidian:  '#0a0a0a',
        ink:       '#111111',
        charcoal:  '#1a1a1a',
        graphite:  '#252525',
        steel:     '#333333',
        ash:       '#555555',
        smoke:     '#777777',
        mist:      '#999999',
        silver:    '#bbbbbb',
        parchment: '#e2d9ce',
        ivory:     '#f2ede7',
        pearl:     '#f9f6f2',
        gold:      '#b8975a',
        'gold-lt': '#d4b37a',
        'gold-dk': '#8a6e3e',
        champagne: '#e8d5a3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Outfit"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      letterSpacing: {
        'ultra':   '0.35em',
        'widest':  '0.22em',
        'wider':   '0.14em',
      },
      transitionTimingFunction: {
        'silk':      'cubic-bezier(0.16, 1, 0.3, 1)',
        'cinematic': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'expo':      'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
}
