import { Participant } from 'livekit-client'
import { menuRecipe } from '@/primitives/menuRecipe'
import { HStack } from '@/styled-system/jsx'
import { RiCloseLine } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { useRemoveParticipant } from '@/features/rooms/api/removeParticipant'

// Русские тексты для компонента
const texts = {
  remove: {
    label: 'Удалить из звонка',
    ariaLabel: 'Удалить {{name}} из звонка',
  },
}

export const RemoveMenuItem = ({
  participant,
}: {
  participant: Participant
}) => {
  const { removeParticipant } = useRemoveParticipant()

  const formatText = (text: string, vars: Record<string, string>) => {
    let result = text
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, value)
    })
    return result
  }

  return (
    <MenuItem
      aria-label={formatText(texts.remove.ariaLabel, {
        name: participant.name || '',
      })}
      className={menuRecipe({ icon: true }).item}
      onAction={() => removeParticipant(participant)}
    >
      <HStack gap={0.25}>
        <RiCloseLine size={20} aria-hidden />
        {texts.remove.label}
      </HStack>
    </MenuItem>
  )
}
