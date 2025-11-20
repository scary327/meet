import { CenteredContent } from '@/layout/CenteredContent'
import { Screen } from '@/layout/Screen'
import { Text } from '@/primitives/Text'
import { Bold } from '@/primitives'

export const NotFoundScreen = () => {
  return (
    <Screen layout="centered">
      <CenteredContent title="Проверьте код встречи" withBackButton>
        <Text centered>
          Убедитесь, что вы ввели правильный код встречи в URL. Пример:{' '}
          <Bold>{window.origin}/xxx-yyyy-zzz.</Bold>
        </Text>
      </CenteredContent>
    </Screen>
  )
}
