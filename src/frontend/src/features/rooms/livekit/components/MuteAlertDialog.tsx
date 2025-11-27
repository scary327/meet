import { Button, Dialog, P } from '@/primitives'
import { HStack } from '@/styled-system/jsx'

// Русские тексты для компонента
const texts = {
  heading: 'Отключить микрофон {{name}}',
  description:
    'Отключить микрофон {{name}} для всех участников? {{name}} сможет включить микрофон только самостоятельно.',
  confirm: 'Отключить',
  cancel: 'Отмена',
}

export const MuteAlertDialog = ({
  isOpen,
  onClose,
  onSubmit,
  name,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  name: string
}) => {
  const formatText = (text: string, vars: Record<string, string>) => {
    let result = text
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, value)
    })
    return result
  }

  return (
    <Dialog
      isOpen={isOpen}
      role="alertdialog"
      aria-label={formatText(texts.heading, { name })}
    >
      <P>{formatText(texts.description, { name })}</P>
      <HStack gap={1}>
        <Button variant="text" size="sm" onPress={onClose}>
          {texts.cancel}
        </Button>
        <Button variant="text" size="sm" onPress={onSubmit}>
          {texts.confirm}
        </Button>
      </HStack>
    </Dialog>
  )
}
