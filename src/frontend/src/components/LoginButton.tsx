import { Button } from '@/primitives'
import { authUrl } from '@/features/auth'
// import { useTranslation } from 'react-i18next'
import { useConfig } from '@/api/useConfig'
import { ProConnectButton } from './ProConnectButton'
import { css } from '@/styled-system/css'

type LoginButtonProps = {
  proConnectHint?: boolean // Hide hint in layouts where space doesn't allow it.
}

export const LoginButton = ({ proConnectHint = true }: LoginButtonProps) => {
  // const { t } = useTranslation('global', { keyPrefix: 'login' })
  const { data } = useConfig()

  if (data?.use_proconnect_button) {
    return <ProConnectButton hint={proConnectHint} />
  }

  const handleLogin = () => {
    window.location.href = authUrl()
  }

  return (
    <Button
      onPress={handleLogin}
      data-attr="login-button"
      variant="primary"
      className={css({
        fontWeight: 'extrabold',
        fontSize: '24px',
        backgroundColor: 'black',
        color: 'white',
        display: { base: 'none', md: 'inline-flex' },
        _hover: {
          backgroundColor: '#1a1a1a',
        },
      })}
    >
      Войти
    </Button>
  )
}
