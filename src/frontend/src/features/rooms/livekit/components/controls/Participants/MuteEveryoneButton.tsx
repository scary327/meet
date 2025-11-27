import { Button } from '@/primitives'
import { Participant } from 'livekit-client'
import { useIsAdminOrOwner } from '@/features/rooms/livekit/hooks/useIsAdminOrOwner'
import { useMuteParticipants } from '@/features/rooms/api/muteParticipants'
import { RiMicOffLine } from '@remixicon/react'
import { css } from '@/styled-system/css'

// Русские тексты для компонента
const texts = {
  muteParticipants: 'Отключить все микрофоны',
}

type MuteEveryoneButtonProps = {
  participants: Array<Participant>
}

export const MuteEveryoneButton = ({
  participants,
}: MuteEveryoneButtonProps) => {
  const { muteParticipants } = useMuteParticipants()

  const isAdminOrOwner = useIsAdminOrOwner()
  if (!isAdminOrOwner || !participants.length) return null

  return (
    <Button
      aria-label={texts.muteParticipants}
      size="sm"
      fullWidth
      variant="secondary"
      onPress={() => muteParticipants(participants)}
      data-attr="participants-mute"
      className={css({
        marginBottom: '0.5rem',
      })}
    >
      <RiMicOffLine size={16} />
      {texts.muteParticipants}
    </Button>
  )
}
