import { css } from '@/styled-system/css'
import { HStack, Stack } from '@/styled-system/jsx'
// import { useTranslation } from 'react-i18next'
import { Button, Text } from '@/primitives'
import { SettingsButton } from '@/features/settings'
import { useUser } from '@/features/auth'
import { useMatchesRoute } from '@/navigation/useMatchesRoute'
import { FeedbackBanner } from '@/components/FeedbackBanner'
import { Menu } from '@/primitives/Menu'
import { MenuList } from '@/primitives/MenuList'
// import { LoginButton } from '@/components/LoginButton'
import { Logo } from '@/components/Logo'

import { useLoginHint } from '@/hooks/useLoginHint'

const LoginHint = () => {
  // const { t } = useTranslation()
  const { isVisible, closeLoginHint } = useLoginHint()
  if (!isVisible) return null
  return (
    <div
      className={css({
        position: 'absolute',
        top: '103px',
        right: '110px',
        zIndex: '100',
        outline: 'none',
        padding: '1.25rem',
        maxWidth: '350px',
        boxShadow: '0 2px 5px rgba(0 0 0 / 0.1)',
        borderRadius: '1rem',
        backgroundColor: 'primary.200',
        display: 'none',
        xsm: {
          display: 'block',
        },
        sm: {
          top: '131px',
          right: '100px',
          zIndex: '100',
        },
        _after: {
          content: '""',
          position: 'absolute',
          top: '-10px',
          right: '20%',
          marginLeft: '-10px',
          borderWidth: '0 10px 10px 10px',
          borderStyle: 'solid',
          borderColor: 'transparent transparent #E3E3FB transparent',
        },
      })}
    >
      <Text variant="h3" margin={false} bold>
        Подсказка для входа
      </Text>
      <Text variant="paragraph" margin={false}>
        Войдите, чтобы получить доступ ко всем функциям
      </Text>
      <Button
        aria-label="Закрыть подсказку"
        size="sm"
        className={css({
          marginLeft: 'auto',
        })}
        onPress={() => closeLoginHint()}
      >
        Понятно
      </Button>
    </div>
  )
}

export const Header = () => {
  // const { t } = useTranslation()
  const isHome = useMatchesRoute('home')
  const isLegalTerms = useMatchesRoute('legalTerms')
  const isAccessibility = useMatchesRoute('accessibility')
  const isTermsOfService = useMatchesRoute('termsOfService')
  // const isRoom = useMatchesRoute('room')
  const { user, isLoggedIn, logout } = useUser()

  return (
    <>
      <FeedbackBanner />
      <div
        className={css({
          paddingBottom: 1,
          paddingX: 1,
          paddingTop: 0.25,
          flexShrink: 0,
        })}
      >
        <HStack gap={2} justify="space-between" alignItems="center">
          {/* Logo on the left */}
          <Logo />

          {/* Navigation on the right */}
          <nav style={{ marginLeft: 'auto', position: 'relative' }}>
            <Stack gap={1} direction="row" align="center">
              {isLoggedIn === false &&
                !isHome &&
                !isLegalTerms &&
                !isAccessibility &&
                !isTermsOfService && (
                  <>
                    <LoginHint />
                  </>
                )}
              {!!user && (
                <Menu>
                  <Button
                    size="sm"
                    variant="primaryTextDark"
                    tooltip="Вы вошли как"
                    tooltipType="delayed"
                    className={css({
                      borderRadius: '8px',
                      _hover: {
                        backgroundColor: '#0e0b10',
                        color: 'white',
                      },
                    })}
                  >
                    <span
                      className={css({
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '350px',
                        display: { base: 'none', xsm: 'block' },
                      })}
                    >
                      {user?.full_name || user?.email}
                    </span>
                  </Button>
                  <MenuList
                    variant={'light'}
                    items={[{ value: 'logout', label: 'Выйти' }]}
                    onAction={(value) => {
                      if (value === 'logout') {
                        logout()
                      }
                    }}
                  />
                </Menu>
              )}
              <SettingsButton />
            </Stack>
          </nav>
        </HStack>
      </div>
    </>
  )
}
