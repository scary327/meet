import { css } from '@/styled-system/css'

export const HiveDev = () => {
  const handleClick = () => {
    window.open('https://t.me/Hive_Dev_Eugene', '_blank')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={css({
        padding: '1rem',
        fontSize: 'clamp(40px, 10vw, 120px)',
        fontFamily: 'NAMU',
        fontWeight: 600,
        color: '#000',
        textAlign: 'center',
        cursor: 'pointer',
        lineHeight: 1,
        transition: 'opacity 0.2s ease-in-out',
        _hover: {
          opacity: 0.9,
        },
        _focus: {
          outline: '2px solid var(--colors-focus-ring)',
          outlineOffset: '2px',
        },
      })}
      aria-label="Hive-dev Telegram link"
    >
      Hive-dev
    </div>
  )
}
