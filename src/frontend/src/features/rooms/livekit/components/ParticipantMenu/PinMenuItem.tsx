import { Participant } from 'livekit-client'
import { menuRecipe } from '@/primitives/menuRecipe'
import { HStack } from '@/styled-system/jsx'
import { RiPushpin2Line, RiUnpinLine } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { useFocusToggleParticipant } from '@/features/rooms/livekit/hooks/useFocusToggleParticipant'

// Русские тексты для компонента
const texts = {
  pin: {
    label: 'Закрепить',
    ariaLabel: 'Закрепить {{name}}',
  },
  unpin: {
    label: 'Открепить',
    ariaLabel: 'Открепить {{name}}',
  },
}

export const PinMenuItem = ({ participant }: { participant: Participant }) => {
  const { toggle, inFocus } = useFocusToggleParticipant(participant)

  const formatText = (text: string, vars: Record<string, string>) => {
    let result = text
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, value)
    })
    return result
  }

  return (
    <MenuItem
      aria-label={formatText(
        inFocus ? texts.unpin.ariaLabel : texts.pin.ariaLabel,
        {
          name: participant.name || '',
        }
      )}
      className={menuRecipe({ icon: true }).item}
      onAction={toggle}
    >
      <HStack gap={0.25}>
        {inFocus ? (
          <>
            <RiUnpinLine size={20} aria-hidden />
            {texts.unpin.label}
          </>
        ) : (
          <>
            <RiPushpin2Line size={20} aria-hidden />
            {texts.pin.label}
          </>
        )}
      </HStack>
    </MenuItem>
  )
}
