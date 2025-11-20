import { CenteredContent } from '@/layout/CenteredContent'
import { Screen } from '@/layout/Screen'
import { Center } from '@/styled-system/jsx'
import { Text } from '@/primitives'

export const ErrorScreen = ({
  title,
  body,
}: {
  title?: string
  body?: string
}) => {
  return (
    <Screen layout="centered">
      <CenteredContent title={title ?? 'При загрузке страницы произошла ошибка'} withBackButton>
        {!!body && (
          <Center>
            <Text as="p" variant="h3" centered>
              {body}
            </Text>
          </Center>
        )}
      </CenteredContent>
    </Screen>
  )
}
