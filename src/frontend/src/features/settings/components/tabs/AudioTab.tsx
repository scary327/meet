import { DialogProps, Field, Switch, Text } from '@/primitives'

import { TabPanel, TabPanelProps } from '@/primitives/Tabs'
import {
  useIsSpeaking,
  useMediaDeviceSelect,
  useRoomContext,
} from '@livekit/components-react'
import { isSafari } from '@/utils/livekit'
import { SoundTester } from '@/components/SoundTester'
import { ActiveSpeaker } from '@/features/rooms/components/ActiveSpeaker'
import { usePersistentUserChoices } from '@/features/rooms/livekit/hooks/usePersistentUserChoices'
import { useNoiseReductionAvailable } from '@/features/rooms/livekit/hooks/useNoiseReductionAvailable'
import posthog from 'posthog-js'
import { RowWrapper } from './layout/RowWrapper'

export type AudioTabProps = Pick<DialogProps, 'onOpenChange'> &
  Pick<TabPanelProps, 'id'>

type DeviceItems = Array<{ value: string; label: string }>

export const AudioTab = ({ id }: AudioTabProps) => {
  const { localParticipant } = useRoomContext()

  const {
    userChoices: { noiseReductionEnabled, audioDeviceId, audioOutputDeviceId },
    saveAudioInputDeviceId,
    saveNoiseReductionEnabled,
    saveAudioOutputDeviceId,
  } = usePersistentUserChoices()

  const isSpeaking = useIsSpeaking(localParticipant)

  const { devices: devicesOut, setActiveMediaDevice: setActiveMediaDeviceOut } =
    useMediaDeviceSelect({ kind: 'audiooutput' })

  const { devices: devicesIn, setActiveMediaDevice: setActiveMediaDeviceIn } =
    useMediaDeviceSelect({ kind: 'audioinput' })

  const itemsOut: DeviceItems = devicesOut.map((d) => ({
    value: d.deviceId,
    label: d.label,
  }))

  const itemsIn: DeviceItems = devicesIn.map((d) => ({
    value: d.deviceId,
    label: d.label,
  }))

  const isMicEnabled = devicesIn?.length > 0

  const disabledProps = isMicEnabled
    ? {}
    : {
        placeholder: 'Требуется разрешение',
        isDisabled: true,
        defaultSelectedKey: undefined,
      }

  const noiseReductionAvailable = useNoiseReductionAvailable()

  return (
    <TabPanel flex id={id}>
      <RowWrapper heading="Микрофон">
        <Field
          type="select"
          label="Выберите входное аудиоустройство"
          items={itemsIn}
          selectedKey={audioDeviceId}
          onSelectionChange={async (key) => {
            await setActiveMediaDeviceIn(key as string)
            saveAudioInputDeviceId(key as string)
          }}
          {...disabledProps}
          style={{
            width: '100%',
          }}
        />
        <>
          {localParticipant.isMicrophoneEnabled ? (
            <ActiveSpeaker isSpeaking={isSpeaking} />
          ) : (
            <span>Микрофон отключен</span>
          )}
        </>
      </RowWrapper>
      {/* Safari has a known limitation where its implementation of 'enumerateDevices' does not include audio output devices.
        To prevent errors or an empty selection list, we only render the speakers selection field on non-Safari browsers. */}
      {!isSafari() ? (
        <RowWrapper heading="Громкоговорители">
          <Field
            type="select"
            label="Выберите выходное аудиоустройство"
            items={itemsOut}
            selectedKey={audioOutputDeviceId}
            onSelectionChange={async (key) => {
              await setActiveMediaDeviceOut(key as string)
              saveAudioOutputDeviceId(key as string)
            }}
            {...disabledProps}
            style={{
              minWidth: 0,
            }}
          />
          <SoundTester />
        </RowWrapper>
      ) : (
        <RowWrapper heading="Громкоговорители">
          <Text variant="warning" margin="md">
            Выбор громкоговорителей пока недоступен в Safari из-за ограничений браузера.
          </Text>
          <div />
        </RowWrapper>
      )}
      {noiseReductionAvailable && (
        <RowWrapper heading="Шумоподавление" beta>
          <Switch
            aria-label={noiseReductionEnabled ? 'Отключить шумоподавление' : 'Включить шумоподавление'}
            isSelected={noiseReductionEnabled}
            onChange={(v) => {
              saveNoiseReductionEnabled(v)
              if (v) posthog.capture('noise-reduction-init')
            }}
          >
            Шумоподавление
          </Switch>
          <div />
        </RowWrapper>
      )}
    </TabPanel>
  )
}
