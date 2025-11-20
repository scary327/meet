import { Button } from '@/primitives'
import { useEffect, useRef, useState } from 'react'
import { useMediaDeviceSelect } from '@livekit/components-react'

export const SoundTester = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { activeDeviceId } = useMediaDeviceSelect({ kind: 'audiooutput' })

  useEffect(() => {
    const updateActiveId = async (deviceId: string) => {
      try {
        await audioRef?.current?.setSinkId(deviceId)
      } catch (error) {
        console.error(`Error setting sinkId: ${error}`)
      }
    }
    updateActiveId(activeDeviceId)
  }, [activeDeviceId])

  // prevent pausing the sound
  navigator.mediaSession.setActionHandler('pause', function () {})

  return (
    <>
      <Button
        variant="secondaryText"
        onPress={() => {
          setIsPlaying(!isPlaying)
          if (!isPlaying) {
            audioRef.current?.play()
          } else {
            audioRef.current?.pause()
          }
        }}
      >
        {isPlaying ? 'Тестирование звука…' : 'Тест'}
      </Button>
      {/* eslint-disable jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="/assets/notification.mp3"
        onEnded={() => setIsPlaying(false)}
      />
    </>
  )
}
