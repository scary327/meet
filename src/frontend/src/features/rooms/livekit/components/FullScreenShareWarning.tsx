import { css } from '@/styled-system/css'
import { Button, Text } from '@/primitives'
import { useMemo, useRef } from 'react'
import { screenSharePreferenceStore } from '@/stores/screenSharePreferences'
import { useSnapshot } from 'valtio'
import { useLocalParticipant } from '@livekit/components-react'
import { useSize } from '../hooks/useResizeObserver'
import { TrackReferenceOrPlaceholder } from '@livekit/components-core'
import { useTranslation } from 'react-i18next'

export const FullScreenShareWarning = ({
  trackReference,
}: {
  trackReference: TrackReferenceOrPlaceholder
}) => {
  const { t } = useTranslation('rooms', { keyPrefix: 'fullScreenWarning' })

  const warningContainerRef = useRef<HTMLDivElement>(null)
  const { width: containerWidth } = useSize(warningContainerRef)
  const { localParticipant } = useLocalParticipant()
  const screenSharePreferences = useSnapshot(screenSharePreferenceStore)

  const isFullScreenSharing = useMemo(() => {
    if (trackReference?.source !== 'screen_share') return false

    const mediaStreamTrack = trackReference.publication?.track?.mediaStreamTrack

    if (!mediaStreamTrack) return false

    // Method 1: Display Surface Check (Chrome & Edge)
    const trackSettings = mediaStreamTrack.getSettings()
    if (trackSettings?.displaySurface) {
      return trackSettings.displaySurface === 'monitor'
    }

    // Method 2: Track Constraints Check
    const constraints = mediaStreamTrack.getConstraints()
    if (constraints?.displaySurface) {
      return constraints.displaySurface === 'monitor'
    }

    // Method 3: Label Analysis (Firefox, Safari)
    const trackLabel = mediaStreamTrack.label.toLowerCase()
    const fullScreenIndicators = [
      'monitor',
      'screen',
      'display',
      'entire screen',
      'full screen',
    ]
    return fullScreenIndicators.some((indicator) =>
      trackLabel.includes(indicator)
    )
  }, [trackReference])

  const shouldShowWarning =
    screenSharePreferences.enabled && isFullScreenSharing

  const handleStopScreenShare = async () => {
    if (!localParticipant.isScreenShareEnabled) return
    await localParticipant.setScreenShareEnabled(false, {}, {})
  }

  const handleDismissWarning = () => {
    screenSharePreferenceStore.enabled = false
  }

  if (!shouldShowWarning) return null

  return (
    <div
      className={css({
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'none',
      })}
      ref={warningContainerRef}
    >
      {(!containerWidth || containerWidth >= 300) && (
        <div
          className={css({
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(22, 22, 34, 0.9)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto',
            zIndex: 11,
          })}
        >
          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '600px',
              md: {
                flexDirection: 'row',
                alignItems: 'center',
              },
            })}
          >
            <Text
              style={{
                color: 'white',
                flexBasis: '55%',
                fontWeight: '500',
              }}
              margin={false}
              wrap={'pretty'}
            >
              {t('message')}
            </Text>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                flexShrink: 0,
              })}
            >
              <Button
                variant="tertiary"
                size="sm"
                style={{
                  height: 'fit-content',
                  pointerEvents: 'auto',
                }}
                onPress={async () => {
                  await handleStopScreenShare()
                }}
              >
                {t('stop')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                style={{
                  height: 'fit-content',
                  pointerEvents: 'auto',
                }}
                onPress={() => handleDismissWarning()}
              >
                {t('ignore')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
