import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])
  return (
    <button
      type='button'
      aria-label='ThemeSwitcher'
      onClick={() =>
        setTheme(
          theme === 'light' ? 'dark' : theme === 'system' ? 'dark' : 'light'
        )
      }
      className='inline-flex items-center justify-center h-9 w-9 text-ink-mute hover:text-ink dark:hover:text-ink-invert transition-colors'
    >
      {hasMounted && theme === 'dark' ? (
        <MoonIcon className='h-4 w-4' />
      ) : (
        <SunIcon className='h-4 w-4' />
      )}
    </button>
  )
}

export default ThemeSwitcher
