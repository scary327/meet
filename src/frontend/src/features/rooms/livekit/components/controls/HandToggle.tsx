import { RiHand } from '@remixicon/react'
import { ToggleButton } from '@/primitives'
import { css } from '@/styled-system/css'
import { useRoomContext } from '@livekit/components-react'
import { useRaisedHand } from '@/features/rooms/livekit/hooks/useRaisedHand'
import { useEffect, useRef, useState } from 'react'
import {
  closeLowerHandToasts,
  showLowerHandToast,
} from '@/features/notifications/utils'

const texts = {
  hand: {
    raise: 'Поднять руку',
    lower: 'Опустить руку',
  },
}

const SPEAKING_DETECTION_DELAY = 3000

export const HandToggle = () => {
  const room = useRoomContext()
  const { isHandRaised, toggleRaisedHand } = useRaisedHand({
    participant: room.localParticipant,
  })

  const isSpeaking = room.localParticipant.isSpeaking
  const speakingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [hasShownToast, setHasShownToast] = useState(false)

  const resetToastState = () => {
    setHasShownToast(false)
  }

  useEffect(() => {
    if (isHandRaised) return
    closeLowerHandToasts()
  }, [isHandRaised])

  useEffect(() => {
    const shouldShowToast = isSpeaking && isHandRaised && !hasShownToast

    if (shouldShowToast && !speakingTimerRef.current) {
      speakingTimerRef.current = setTimeout(() => {
        setHasShownToast(true)
        const onClose = () => {
          if (isHandRaised) toggleRaisedHand()
          resetToastState()
        }
        showLowerHandToast(room.localParticipant, onClose)
      }, SPEAKING_DETECTION_DELAY)
    }
    if ((!isSpeaking || !isHandRaised) && speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current)
      speakingTimerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeaking, isHandRaised, hasShownToast, toggleRaisedHand])

  const tooltipLabel = isHandRaised ? texts.hand.lower : texts.hand.raise

  return (
    <div
      className={css({
        position: 'relative',
        display: 'inline-block',
      })}
    >
      <ToggleButton
        square
        variant="primaryDark"
        aria-label={tooltipLabel}
        tooltip={tooltipLabel}
        isSelected={isHandRaised}
        onPress={() => {
          toggleRaisedHand()
          resetToastState()
        }}
        data-attr={`controls-hand-${isHandRaised ? 'lower' : 'raise'}`}
      >
        <RiHand />
      </ToggleButton>
    </div>
  )
}
