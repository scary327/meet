import { useConnectionState, useRoomContext } from '@livekit/components-react'
import { Button } from '@/primitives'
import { RiPhoneFill } from '@remixicon/react'
import { ConnectionState } from 'livekit-client'

// Русские тексты для компонента
const texts = {
  leave: 'Выйти',
}

export const LeaveButton = () => {
  const room = useRoomContext()
  const connectionState = useConnectionState(room)
  return (
    <Button
      isDisabled={connectionState === ConnectionState.Disconnected}
      variant={'danger'}
      tooltip={texts.leave}
      aria-label={texts.leave}
      onPress={() => {
        room
          .disconnect(true)
          .catch((e) =>
            console.error('An error occurred while disconnecting:', e)
          )
      }}
      data-attr="controls-leave"
    >
      <RiPhoneFill
        style={{
          transform: 'rotate(135deg)',
        }}
      />
    </Button>
  )
}
