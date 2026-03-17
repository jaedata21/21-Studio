/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void:      '#030303',
        obsidian:  '#080808',
        ink:       '#0f0f0f',
        charcoal:  '#161616',
        graphite:  '#222222',
        steel:     '#2e2e2e',
        ash:       '#444444',
        smoke:     '#666666',
        mist:      '#888888',
        silver:    '#aaaaaa',
        parchment: '#ddd5c8',
        ivory:     '#ede8e0',
        pearl:     '#f5f2ed',
        gold:      '#c4a456',
        'gold-lt': '#d9bc7a',
        'gold-dk': '#96793a',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Josefin Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'silk':      'cubic-bezier(0.16, 1, 0.3, 1)',
        'cinematic': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'expo':      'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      letterSpacing: {
        'ultra':  '0.32em',
        'widest': '0.22em',
        'wider':  '0.14em',
      },
    },
  },
  plugins: [],
}
