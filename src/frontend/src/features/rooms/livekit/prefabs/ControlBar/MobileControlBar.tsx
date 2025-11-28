import { supportsScreenSharing } from '@livekit/components-core'
import { useTranslation } from 'react-i18next'
import { ControlBarAuxProps } from './ControlBar'
import React from 'react'
import { css } from '@/styled-system/css'
import { LeaveButton } from '../../components/controls/LeaveButton'
import { Track } from 'livekit-client'
import { HandToggle } from '../../components/controls/HandToggle'
import { Button } from '@/primitives/Button'
import {
  RiAccountBoxLine,
  RiMegaphoneLine,
  RiMore2Line,
  RiSettings3Line,
} from '@remixicon/react'
import { ScreenShareToggle } from '../../components/controls/ScreenShareToggle'
import { ChatToggle } from '../../components/controls/ChatToggle'
import { ParticipantsToggle } from '../../components/controls/Participants/ParticipantsToggle'
import { useSidePanel } from '../../hooks/useSidePanel'
import { LinkButton } from '@/primitives'
import { ResponsiveMenu } from './ResponsiveMenu'
import { ToolsToggle } from '../../components/controls/ToolsToggle'
import { useConfig } from '@/api/useConfig'
import { AudioDevicesControl } from '../../components/controls/Device/AudioDevicesControl'
import { VideoDeviceControl } from '../../components/controls/Device/VideoDeviceControl'
import { useSettingsDialog } from '@/features/settings/hook/useSettingsDialog'

export function MobileControlBar({
  onDeviceError,
}: Readonly<ControlBarAuxProps>) {
  const { t } = useTranslation('rooms')
  const [isMenuOpened, setIsMenuOpened] = React.useState(false)
  const browserSupportsScreenSharing = supportsScreenSharing()
  const { toggleEffects } = useSidePanel()
  const { openSettingsDialog } = useSettingsDialog()

  const { data } = useConfig()

  return (
    <>
      <div
        className={css({
          width: '100vw',
          display: 'flex',
          position: 'absolute',
          padding: '1.125rem',
          justifyContent: 'center',
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: 'auto',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            width: '330px',
            backgroundColor: '#0e0b10',
            borderRadius: '28px',
            padding: '0.25rem',
            gap: '0.25rem',
          })}
        >
          <LeaveButton />
          <AudioDevicesControl
            onDeviceError={(error) =>
              onDeviceError?.({ source: Track.Source.Microphone, error })
            }
            hideMenu={true}
          />
          <VideoDeviceControl
            onDeviceError={(error) =>
              onDeviceError?.({ source: Track.Source.Camera, error })
            }
            hideMenu={true}
          />
          <HandToggle />
          <Button
            square
            variant="primaryDark"
            aria-label={t('options.buttonLabel')}
            tooltip={t('options.buttonLabel')}
            onPress={() => setIsMenuOpened(true)}
          >
            <RiMore2Line />
          </Button>
        </div>
      </div>
      <ResponsiveMenu
        isOpened={isMenuOpened}
        onClosed={() => setIsMenuOpened(false)}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'center',
          })}
        >
          <div
            className={css({
              flexGrow: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gridGap: '1rem',
              '& > *': {
                alignSelf: 'stretch',
                justifySelf: 'stretch',
                width: '100%',
                height: '100%',
              },
            })}
          >
            {browserSupportsScreenSharing && (
              <ScreenShareToggle
                onDeviceError={(error) =>
                  onDeviceError?.({ source: Track.Source.ScreenShare, error })
                }
                variant="sidePanelButton"
                onPress={() => setIsMenuOpened(false)}
                description={true}
                className={css({
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  border: '2px solid #fff !important',
                })}
              />
            )}
            <ChatToggle
              onPress={() => setIsMenuOpened(false)}
              variant="sidePanelButton"
              description={true}
              className={css({
                borderRadius: '8px',
                border: '2px solid #fff !important',
                width: '100% !important',
                height: '100% !important',
              })}
            />
            <ParticipantsToggle
              onPress={() => setIsMenuOpened(false)}
              variant="sidePanelButton"
              description={true}
              className={css({
                width: '100% !important',
                height: '100% !important',
                borderRadius: '8px',
                border: '2px solid #fff !important',
              })}
            />
            <ToolsToggle
              onPress={() => setIsMenuOpened(false)}
              variant="sidePanelButton"
              description={true}
              className={css({
                width: '100% !important',
                height: '100% !important',
                borderRadius: '8px',
                border: '2px solid #fff !important',
              })}
            />
            <Button
              onPress={() => {
                toggleEffects()
                setIsMenuOpened(false)
              }}
              variant="sidePanelButton"
              aria-label={t('options.items.effects')}
              tooltip={t('options.items.effects')}
              description={true}
              icon={<RiAccountBoxLine size={20} />}
              className={css({
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                border: '2px solid #fff !important',
              })}
            />
            {data?.feedback?.url && (
              <LinkButton
                href={data?.feedback?.url}
                variant="sidePanelButton"
                tooltip={t('options.items.feedback')}
                aria-label={t('options.items.feedback')}
                target="_blank"
                onPress={() => setIsMenuOpened(false)}
                description={true}
                icon={<RiMegaphoneLine size={20} />}
                className={css({
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  border: '2px solid #fff !important',
                })}
              />
            )}
            <Button
              onPress={() => {
                openSettingsDialog()
                setIsMenuOpened(false)
              }}
              variant="sidePanelButton"
              aria-label={t('options.items.settings')}
              tooltip={t('options.items.settings')}
              description={true}
              icon={<RiSettings3Line size={20} />}
              className={css({
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                border: '2px solid #fff !important',
              })}
            />
          </div>
        </div>
      </ResponsiveMenu>
    </>
  )
}
