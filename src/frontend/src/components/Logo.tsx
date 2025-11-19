import BlackStar from '@/assets/blackStar.svg'
import { css } from '@/styled-system/css'

interface LogoProps {
  textColor?: string
  isRoom?: boolean
}

export const Logo = ({ textColor = 'inherit', isRoom = false }: LogoProps) => {
  const topValue = isRoom ? '0.5rem' : '0.75rem'
  const color = isRoom ? 'white' : textColor

  return (
    <div
      className={css({
        position: 'fixed',
        top: topValue,
        left: '0.75rem',
        zIndex: 50,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      })}
    >
      <img
        src={BlackStar}
        alt="Black Star"
        style={{
          filter: isRoom ? 'brightness(0) invert(1)' : 'none',
        }}
      />
      <span
        className={css({
          fontSize: '14px',
          lineHeight: '1.5',
          color: color,
        })}
      >
        Сервер видео конференцсвязи
      </span>
    </div>
  )
}
