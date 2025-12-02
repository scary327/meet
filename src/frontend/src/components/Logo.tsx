import BlackStar from '@/assets/blackStar.svg'
import { css } from '@/styled-system/css'

interface LogoProps {
  textColor?: string
}

export const Logo = ({ textColor = 'inherit' }: LogoProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexShrink: 0,
      })}
    >
      <img src={BlackStar} alt="Black Star" />
      <span
        className={css({
          fontSize: '14px',
          lineHeight: '1.5',
          color: textColor,
        })}
      >
        Сервер видео конференцсвязи
      </span>
    </div>
  )
}
