import { Participant } from 'livekit-client'
import { styled } from '@/styled-system/jsx'
import { useIsSpeaking } from '@livekit/components-react'
import { useSize } from '@/features/rooms/livekit/hooks/useResizeObserver'
import { useMemo, useRef } from 'react'
import { getAvatarByUserName } from '@/features/rooms/utils/getAvatarByUserName'

const StyledParticipantPlaceHolder = styled('div', {
  base: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0e0b10',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type ParticipantPlaceholderProps = {
  participant: Participant
}

export const ParticipantPlaceholder = ({
  participant,
}: ParticipantPlaceholderProps) => {
  const isSpeaking = useIsSpeaking(participant)
  const imgSrc = useMemo(
    () =>
      getAvatarByUserName(participant.name || 'Guest'),
    [participant.name]
  )

  const placeholderEl = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(placeholderEl)

  const minDimension = Math.min(width, height)
  const avatarSize = useMemo(
    () => Math.min(Math.round(minDimension * 0.5), 120),
    [minDimension]
  )

  return (
    <StyledParticipantPlaceHolder ref={placeholderEl}>
      <img
        src={imgSrc}
        alt={participant.name || participant.identity || 'Guest'}
        draggable={false}
        style={{
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          animation: isSpeaking ? 'pulse 1s infinite' : undefined,
        }}
      />
    </StyledParticipantPlaceHolder>
  )
}
