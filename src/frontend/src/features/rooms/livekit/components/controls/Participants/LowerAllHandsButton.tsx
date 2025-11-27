import { Button } from '@/primitives'
import { Participant } from 'livekit-client'
import { useLowerHandParticipants } from '@/features/rooms/api/lowerHandParticipants'
import { useIsAdminOrOwner } from '@/features/rooms/livekit/hooks/useIsAdminOrOwner'
import { css } from '@/styled-system/css'
import { RiHand } from '@remixicon/react'

// Русские тексты для компонента
const texts = {
  lowerParticipantsHand: 'Опустить все руки',
}

type LowerAllHandsButtonProps = {
  participants: Array<Participant>
}

export const LowerAllHandsButton = ({
  participants,
}: LowerAllHandsButtonProps) => {
  const { lowerHandParticipants } = useLowerHandParticipants()

  const isAdminOrOwner = useIsAdminOrOwner()
  if (!isAdminOrOwner) return null

  return (
    <Button
      aria-label={texts.lowerParticipantsHand}
      size="sm"
      fullWidth
      variant="secondary"
      onPress={() => lowerHandParticipants(participants)}
      data-attr="participants-lower-hands"
      className={css({
        marginBottom: '0.5rem',
      })}
    >
      <RiHand size={16} />
      {texts.lowerParticipantsHand}
    </Button>
  )
}
