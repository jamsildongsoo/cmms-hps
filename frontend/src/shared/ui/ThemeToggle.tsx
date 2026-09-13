import type { Theme } from '../../core/theme/theme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-switcher"
      type="button"
      aria-label={isDark ? '라이트 테마로 변경' : '다크 테마로 변경'}
      title={isDark ? '라이트 테마로 변경' : '다크 테마로 변경'}
      onClick={onToggle}
    >
      {isDark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.42-1.42M4.92 19.08l1.42-1.42m0-11.32L4.92 4.92m14.16 14.16-1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20.7 15.2A8.5 8.5 0 0 1 8.8 3.3 8.5 8.5 0 1 0 20.7 15.2Z" />
        </svg>
      )}
    </button>
  )
}
