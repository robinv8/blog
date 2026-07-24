const BLOG = require('./blog.config')
const { fontFamily } = require('tailwindcss/defaultTheme')
const CJK = require('./lib/cjk')
const fontSansCJK = !CJK()
  ? []
  : [`"Noto Sans CJK ${CJK()}"`, `"Noto Sans ${CJK()}"`]
const fontSerifCJK = !CJK()
  ? []
  : [`"Noto Serif CJK ${CJK()}"`, `"Noto Serif ${CJK()}"`]

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js', './layouts/**/*.js'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    extend: {
      colors: {
        day: BLOG.lightBackground || '#F4F0E6',
        night: BLOG.darkBackground || '#1A1714',
        // Warm paper palette
        paper: {
          DEFAULT: '#F4F0E6',
          soft: '#EBE6DA',
          dark: '#1A1714',
          raised: '#FAF7F0'
        },
        ink: {
          DEFAULT: '#2C2824',
          soft: '#5C564E',
          mute: '#8A8378',
          faint: '#A39C90',
          line: '#DDD6C8',
          invert: '#F0EBE3'
        },
        rust: {
          DEFAULT: '#A65B3A',
          soft: '#C47A58'
        }
      },
      fontFamily: {
        sans: ['"Source Sans 3"', ...fontFamily.sans, ...fontSansCJK],
        serif: ['"Instrument Serif"', ...fontFamily.serif, ...fontSerifCJK],
        display: ['"Instrument Serif"', ...fontFamily.serif, ...fontSerifCJK],
        noEmoji: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
}
