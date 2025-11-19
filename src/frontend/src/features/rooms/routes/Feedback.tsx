// import { useTranslation } from 'react-i18next'
import { Button } from '@/primitives'
import { Screen } from '@/layout/Screen'
import { Center, HStack, styled, VStack } from '@/styled-system/jsx'
import { Rating } from '@/features/rooms/components/Rating.tsx'
import { useLocation, useSearchParams } from 'wouter'
import { css } from '@/styled-system/css'
import { Logo } from '@/components/Logo.tsx'

// fixme - duplicated with home, refactor in a proper style
const Heading = styled('h1', {
  base: {
    fontWeight: '500',
    fontStyle: 'normal',
    fontStretch: 'normal',
    fontOpticalSizing: 'auto',
    fontSize: '2.3rem',
    lineHeight: '2.5rem',
    letterSpacing: '0',
    paddingBottom: '2rem',
    textAlign: 'center',
  },
})

export const FeedbackRoute = () => {
  // const { t } = useTranslation('rooms')
  const [, setLocation] = useLocation()

  const [searchParams] = useSearchParams()

  const heading = searchParams.get('duplicateIdentity')
    ? 'Вы присоединились к встрече с другого устройства'
    : 'Вы покинули встречу'

  return (
    <Screen layout="centered" footer={false}>
      <Logo />
      <Center>
        <VStack>
          <Heading>{heading}</Heading>
          <HStack>
            <Button variant="secondary" onPress={() => window.history.back()}>
              Вернуться к встрече
            </Button>
            <Button
              variant="primary"
              onPress={() => setLocation('/')}
              className={css({
                backgroundColor: 'black !important',
                color: 'white',
                _hover: {
                  backgroundColor: '#1a1a1a',
                },
              })}
            >
              На главную
            </Button>
          </HStack>
          <Rating />
        </VStack>
      </Center>
    </Screen>
  )
}
