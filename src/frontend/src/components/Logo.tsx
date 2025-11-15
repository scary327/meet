import BlackStar from '@/assets/blackStar.svg'
import { css } from '@/styled-system/css'

export const Logo = () => {
  return (
    <div
      className={css({
        position: 'fixed',
        top: '0.75rem',
        left: '0.75rem',
        zIndex: 50,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      })}
    >
      <img src={BlackStar} alt="Black Star" />
      <span
        className={css({
          fontSize: '14px',
          lineHeight: '1.5',
        })}
      >
        Сервер видео конференцсвязи
      </span>
    </div>
  )
}
