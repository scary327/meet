import { Button, Menu } from '@/primitives'
import { RiMore2Fill } from '@remixicon/react'
import { ParticipantMenu } from './ParticipantMenu'
import { useIsAdminOrOwner } from '@/features/rooms/livekit/hooks/useIsAdminOrOwner'
import type { Participant } from 'livekit-client'

export const ParticipantMenuButton = ({
  participant,
}: {
  participant: Participant
}) => {
  const isAdminOrOwner = useIsAdminOrOwner()
  if (!isAdminOrOwner) return null
  return (
    <Menu>
      <Button
        square
        variant="primaryDark"
        size="xs"
        aria-label="Настройки"
        tooltip="Настройки"
      >
        <RiMore2Fill />
      </Button>
      <ParticipantMenu participant={participant} />
    </Menu>
  )
}
