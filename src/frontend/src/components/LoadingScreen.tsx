import { Screen, type ScreenProps } from '@/layout/Screen'
import { DelayedRender } from './DelayedRender'
import { CenteredContent } from '@/layout/CenteredContent'
import { Center } from '@/styled-system/jsx'

export const LoadingScreen = ({
  delay = 500,
  header = undefined,
  footer = undefined,
  layout = 'centered',
}: {
  delay?: number
} & Omit<ScreenProps, 'children'>) => {
  return (
    <DelayedRender delay={delay}>
      <Screen layout={layout} header={header} footer={footer}>
        <CenteredContent>
          <Center>
            <p>Загрузка…</p>
          </Center>
        </CenteredContent>
      </Screen>
    </DelayedRender>
  )
}
