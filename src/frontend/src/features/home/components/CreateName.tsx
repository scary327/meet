import Avatar from '@/assets/avatar.svg'
import { css } from '@/styled-system/css'

type CreateNameProps = {
  value?: string
  onChange?: (value: string) => void
  error?: string | null
}

export const CreateName = ({
  value = '',
  onChange,
  error,
}: CreateNameProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        })}
      >
        <div
          className={css({
            padding: '15px 19px',
            border: '1px solid black',
            borderRadius: '9999px',
          })}
        >
          <img src={Avatar} alt="Avatar" />
        </div>
        <input
          placeholder="Введите имя"
          className={css({
            minWidth: '45vw',
            padding: '12px 16px',
            border: 'none',
            borderBottom: '1px solid black',
            borderRadius: '0',
            fontSize: '24px',
            outline: 'none',
            _focus: {
              borderBottomColor: 'blue.500',
              boxShadow: '0 1px 0 0 rgba(59, 130, 246, 0.5)',
            },
          })}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
      {error ? (
        <div
          className={css({
            color: 'red.500',
            fontSize: '14px',
            marginTop: '8px',
          })}
        >
          {error}
        </div>
      ) : null}
    </div>
  )
}
