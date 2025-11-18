import { usePreviewTracks } from '@livekit/components-react'
import { css } from '@/styled-system/css'
import { Screen } from '@/layout/Screen'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createLocalVideoTrack,
  createLocalAudioTrack,
  LocalAudioTrack,
  LocalVideoTrack,
  Track,
} from 'livekit-client'
import { H } from '@/primitives/H'
import { Field } from '@/primitives/Field'
import { Button, Dialog, Text, Form } from '@/primitives'
import { VStack } from '@/styled-system/jsx'
import { Heading } from 'react-aria-components'
import { RiImageCircleAiFill } from '@remixicon/react'
import {
  EffectsConfiguration,
  EffectsConfigurationProps,
} from '../livekit/components/effects/EffectsConfiguration'
import { SelectDevice } from '../livekit/components/controls/Device/SelectDevice'
import { ToggleDevice } from '../livekit/components/controls/Device/ToggleDevice'
import { usePersistentUserChoices } from '../livekit/hooks/usePersistentUserChoices'
import { BackgroundProcessorFactory } from '../livekit/components/blur'
import { isMobileBrowser } from '@livekit/components-core'
import { fetchRoom } from '@/features/rooms/api/fetchRoom'
import { keys } from '@/api/queryKeys'
import { useLobby } from '../hooks/useLobby'
import { useQuery } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient'
import { ApiLobbyStatus, ApiRequestEntry } from '../api/requestEntry'
import { Spinner } from '@/primitives/Spinner'
import { ApiAccessLevel } from '../api/ApiRoom'
import { useLoginHint } from '@/hooks/useLoginHint'
import { openPermissionsDialog } from '@/stores/permissions'
import { useResolveInitiallyDefaultDeviceId } from '../livekit/hooks/useResolveInitiallyDefaultDeviceId'
import { isSafari } from '@/utils/livekit'
import type { LocalUserChoices } from '@/stores/userChoices'
import { useCannotUseDevice } from '../livekit/hooks/useCannotUseDevice'

const onError = (e: Error) => console.error('ERROR', e)

const Effects = ({
  videoTrack,
  onSubmit,
}: Pick<EffectsConfigurationProps, 'videoTrack' | 'onSubmit'>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const openDialog = () => setIsDialogOpen(true)

  if (!BackgroundProcessorFactory.isSupported() || isMobileBrowser()) {
    return
  }

  return (
    <>
      <Dialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        role="dialog"
        type="flex"
        size="large"
      >
        <Heading
          slot="title"
          level={1}
          className={css({
            textStyle: 'h1',
            marginBottom: '0.25rem',
          })}
        >
          Эффекты
        </Heading>
        <Text
          variant="subTitle"
          className={css({
            marginBottom: '1.5rem',
          })}
        >
          Настройте эффекты вашей камеры.
        </Text>
        <EffectsConfiguration videoTrack={videoTrack} onSubmit={onSubmit} />
      </Dialog>
      <Button
        variant="whiteCircle"
        onPress={openDialog}
        tooltip="Применить эффекты"
        aria-label="Применить эффекты"
      >
        <RiImageCircleAiFill size={24} />
      </Button>
    </>
  )
}

export const Join = ({
  enterRoom,
  roomId,
}: {
  enterRoom: () => void
  roomId: string
}) => {
  const {
    userChoices: {
      audioEnabled,
      videoEnabled,
      audioDeviceId,
      audioOutputDeviceId,
      videoDeviceId,
      processorSerialized,
      username,
    },
    saveAudioInputEnabled,
    saveAudioOutputDeviceId,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
    saveUsername,
    saveProcessorSerialized,
  } = usePersistentUserChoices()

  const initialUserChoices = useRef<LocalUserChoices | null>(null)

  if (initialUserChoices.current === null) {
    initialUserChoices.current = {
      audioEnabled,
      videoEnabled,
      audioDeviceId,
      audioOutputDeviceId,
      videoDeviceId,
      processorSerialized,
      username,
    }
  }

  const tracks = usePreviewTracks(
    {
      audio: !!initialUserChoices.current &&
        initialUserChoices.current?.audioEnabled && {
          deviceId: initialUserChoices.current.audioDeviceId,
        },
      video: !!initialUserChoices.current &&
        initialUserChoices.current?.videoEnabled && {
          deviceId: initialUserChoices.current.videoDeviceId,
          processor: BackgroundProcessorFactory.deserializeProcessor(
            initialUserChoices.current.processorSerialized
          ),
        },
    },
    onError
  )

  const [dynamicVideoTrack, setDynamicVideoTrack] =
    useState<LocalVideoTrack | null>(null)
  const [dynamicAudioTrack, setDynamicAudioTrack] =
    useState<LocalAudioTrack | null>(null)

  const previewVideoTrack = useMemo(
    () =>
      tracks?.filter(
        (track) => track.kind === Track.Kind.Video
      )[0] as LocalVideoTrack,
    [tracks]
  )

  const previewAudioTrack = useMemo(
    () =>
      tracks?.filter(
        (track) => track.kind === Track.Kind.Audio
      )[0] as LocalAudioTrack,
    [tracks]
  )

  /*
   * Dynamic track creation strategy: Only create a dynamic track if the user initially disabled audio/video
   * but now wants to enable it. This is a "just-in-time" acquisition pattern where we create the track
   * on-demand. We avoid creating tracks when the user explicitly requested them to be disabled.
   */
  useEffect(() => {
    const createVideoTrack = async () => {
      try {
        const track = await createLocalVideoTrack({
          deviceId: { exact: videoDeviceId },
          processor:
            BackgroundProcessorFactory.deserializeProcessor(
              processorSerialized
            ),
        })
        setDynamicVideoTrack(track)
      } catch (error) {
        onError(error as Error)
      }
    }

    if (
      videoEnabled &&
      !initialUserChoices.current?.videoEnabled &&
      !previewVideoTrack &&
      !dynamicVideoTrack
    ) {
      createVideoTrack()
    }
  }, [
    videoEnabled,
    videoDeviceId,
    processorSerialized,
    previewVideoTrack,
    dynamicVideoTrack,
  ])

  useEffect(() => {
    const createAudioTrack = async () => {
      try {
        const track = await createLocalAudioTrack({
          deviceId: { exact: audioDeviceId },
        })
        setDynamicAudioTrack(track)
      } catch (error) {
        onError(error as Error)
      }
    }
    if (
      audioEnabled &&
      !initialUserChoices.current?.audioEnabled &&
      !previewAudioTrack &&
      !dynamicAudioTrack
    ) {
      createAudioTrack()
    }
  }, [audioEnabled, audioDeviceId, previewAudioTrack, dynamicAudioTrack])

  // Cleanup dynamic tracks
  useEffect(() => {
    return () => {
      dynamicVideoTrack?.stop()
    }
  }, [dynamicVideoTrack])
  useEffect(() => {
    return () => {
      dynamicAudioTrack?.stop()
    }
  }, [dynamicAudioTrack])

  // Final tracks (dynamic takes precedence over preview)
  const videoTrack = dynamicVideoTrack || previewVideoTrack
  const audioTrack = dynamicAudioTrack || previewAudioTrack

  // LiveKit by default populates device choices with "default" value.
  // Instead, use the current device id used by the preview track as a default
  useResolveInitiallyDefaultDeviceId(
    audioDeviceId,
    audioTrack,
    saveAudioInputDeviceId
  )
  useResolveInitiallyDefaultDeviceId(
    videoDeviceId,
    videoTrack,
    saveVideoInputDeviceId
  )

  const videoEl = useRef(null)
  const isVideoInitiated = useRef(false)

  useEffect(() => {
    const videoElement = videoEl.current as HTMLVideoElement | null

    const handleVideoLoaded = () => {
      if (videoElement) {
        isVideoInitiated.current = true
        videoElement.style.opacity = '1'
      }
    }

    if (videoElement && videoTrack && videoEnabled) {
      videoTrack.attach(videoElement)
      videoElement.addEventListener('loadedmetadata', handleVideoLoaded)
    }

    return () => {
      videoTrack?.detach()
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleVideoLoaded)
        videoElement.style.opacity = '0'
      }
      isVideoInitiated.current = false
    }
  }, [videoTrack, videoEnabled])

  // Room data strategy:
  // 1. Initial fetch is performed to check access and get LiveKit configuration
  // 2. Data remains valid for 6 hours to avoid unnecessary refetches
  // 3. State is manually updated via queryClient when a waiting participant is accepted
  // 4. No automatic refetching or revalidation occurs during this period
  // todo - refactor in a hook
  const {
    data: roomData,
    error,
    isError,
    refetch: refetchRoom,
  } = useQuery({
    /* eslint-disable @tanstack/query/exhaustive-deps */
    queryKey: [keys.room, roomId],
    queryFn: () => fetchRoom({ roomId, username }),
    staleTime: 6 * 60 * 60 * 1000, // By default, LiveKit access tokens expire 6 hours after generation
    retry: false,
    enabled: false,
  })

  useEffect(() => {
    if (isError && error?.statusCode == 404) {
      // The room component will handle the room creation if the user is authenticated
      enterRoom()
    }
  }, [isError, error, enterRoom])

  const handleAccepted = (response: ApiRequestEntry) => {
    queryClient.setQueryData([keys.room, roomId], {
      ...roomData,
      livekit: response.livekit,
    })
    enterRoom()
  }

  const { status, startWaiting } = useLobby({
    roomId,
    username,
    onAccepted: handleAccepted,
  })

  const { openLoginHint } = useLoginHint()

  const handleSubmit = async () => {
    const { data } = await refetchRoom()

    if (!data?.livekit) {
      // Display a message to inform the user that by logging in, they won't have to wait for room entry approval.
      if (data?.access_level == ApiAccessLevel.TRUSTED) {
        openLoginHint()
      }
      startWaiting()
      return
    }

    enterRoom()
  }

  const isCameraDeniedOrPrompted = useCannotUseDevice('videoinput')
  const isMicrophoneDeniedOrPrompted = useCannotUseDevice('audioinput')

  const hintMessage = useMemo(() => {
    if (isCameraDeniedOrPrompted) {
      return isMicrophoneDeniedOrPrompted
        ? 'Хотите, чтобы другие видели и слышали вас во время встречи?'
        : 'Хотите, чтобы другие видели вас во время встречи?'
    }
    if (!videoEnabled) {
      return 'Камера отключена.'
    }
    if (!isVideoInitiated.current) {
      return 'Камера запускается...'
    }
    if (videoTrack && videoEnabled) {
      return ''
    }
  }, [
    videoTrack,
    videoEnabled,
    isCameraDeniedOrPrompted,
    isMicrophoneDeniedOrPrompted,
  ])

  const permissionsButtonLabel = useMemo(() => {
    if (!isMicrophoneDeniedOrPrompted && !isCameraDeniedOrPrompted) {
      return null
    }
    if (isCameraDeniedOrPrompted && isMicrophoneDeniedOrPrompted) {
      return 'Разрешить доступ к камере и микрофону'
    }
    if (isCameraDeniedOrPrompted && !isMicrophoneDeniedOrPrompted) {
      return 'Разрешить доступ к камере'
    }
    return null
  }, [isMicrophoneDeniedOrPrompted, isCameraDeniedOrPrompted])

  const renderWaitingState = () => {
    switch (status) {
      case ApiLobbyStatus.TIMEOUT:
        return (
          <VStack alignItems="center" textAlign="center">
            <H lvl={1} margin={false} centered>
              Вы не можете присоединиться к этому звонку
            </H>
            <Text as="p" variant="note">
              Никто не ответил на ваш запрос
            </Text>
          </VStack>
        )

      case ApiLobbyStatus.DENIED:
        return (
          <VStack alignItems="center" textAlign="center">
            <H lvl={1} margin={false} centered>
              Вы не можете присоединиться к этому звонку
            </H>
            <Text as="p" variant="note">
              Ваш запрос на присоединение был отклонен.
            </Text>
          </VStack>
        )

      case ApiLobbyStatus.WAITING:
        return (
          <VStack alignItems="center" textAlign="center">
            <H lvl={1} margin={false} centered>
              Отправка запроса на присоединение...
            </H>
            <Text
              as="p"
              variant="note"
              className={css({ marginBottom: '1.5rem' })}
            >
              Вы сможете присоединиться к этому звонку, как только кто-то вас
              авторизует
            </Text>
            <Spinner />
          </VStack>
        )

      default:
        return (
          <Form
            onSubmit={handleSubmit}
            submitLabel="Присоединиться"
            submitButtonProps={{
              fullWidth: true,
              className: css({
                backgroundColor: 'black !important',
                color: 'white !important',
                fontWeight: 'bold',
                _hover: {
                  backgroundColor: '#1a1a1a !important',
                  transform: 'scale(1.02)',
                },
              }),
            }}
          >
            <VStack marginBottom={1}>
              <H lvl={1} margin="sm" centered>
                Присоединиться к встрече?
              </H>
              <Field
                type="text"
                onChange={saveUsername}
                label="Ваше имя"
                aria-label="Ваше имя"
                defaultValue={username}
                validate={(value) => !value && 'Ваше имя не может быть пустым'}
                wrapperProps={{
                  noMargin: true,
                  fullWidth: true,
                }}
                labelProps={{
                  center: true,
                }}
                maxLength={50}
              />
            </VStack>
          </Form>
        )
    }
  }

  return (
    <Screen footer={false}>
      <div
        className={css({
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '72px',
          paddingLeft: '12px',
          paddingRight: '12px',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '2rem',
        })}
      >
        {/* Video preview section */}
        <div
          className={css({
            width: '100%',
            maxWidth: '640px',
          })}
        >
          <div
            className={css({
              borderRadius: '1rem',
              overflow: 'hidden',
              backgroundColor: 'black',
              position: 'relative',
              aspectRatio: '16 / 9',
            })}
          >
            {/* Video element */}
            <div
              aria-label={
                videoEnabled
                  ? 'Предпросмотр видео включен'
                  : 'Предпросмотр видео отключен'
              }
              role="status"
              className={css({
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
              })}
            >
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoEl}
                width="1280"
                height="720"
                style={{
                  display:
                    !videoEnabled || isCameraDeniedOrPrompted
                      ? 'none'
                      : undefined,
                }}
                className={css({
                  position: 'absolute',
                  transform: 'rotateY(180deg)',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  transition: 'opacity 0.3s ease-in-out',
                  objectFit: 'cover',
                })}
                disablePictureInPicture
                disableRemotePlayback
              />
            </div>

            {/* Hint message overlay */}
            <div
              role="alert"
              className={css({
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                padding: '1rem',
                boxSizing: 'border-box',
                gap: '1rem',
              })}
            >
              <p
                className={css({
                  fontWeight: '400',
                  fontSize: '1.25rem',
                  color: 'white',
                })}
              >
                {hintMessage}
              </p>
              {isCameraDeniedOrPrompted && (
                <Button
                  size="sm"
                  variant="tertiary"
                  onPress={() => openPermissionsDialog('videoinput')}
                >
                  {permissionsButtonLabel}
                </Button>
              )}
            </div>

            {/* Control buttons */}
            <div
              className={css({
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                display: 'flex',
                gap: '1rem',
              })}
            >
              <ToggleDevice
                kind="audioinput"
                context="join"
                enabled={audioEnabled}
                toggle={async () => {
                  saveAudioInputEnabled(!audioEnabled)
                  if (audioEnabled) {
                    await audioTrack?.mute()
                  } else {
                    await audioTrack?.unmute()
                  }
                }}
              />
              <ToggleDevice
                kind="videoinput"
                context="join"
                enabled={videoEnabled}
                toggle={async () => {
                  saveVideoInputEnabled(!videoEnabled)
                  if (videoEnabled) {
                    await videoTrack?.mute()
                  } else {
                    await videoTrack?.unmute()
                  }
                }}
              />
              <Effects
                videoTrack={videoTrack}
                onSubmit={(processor) =>
                  saveProcessorSerialized(processor?.serialize())
                }
              />
            </div>
          </div>

          {/* Device selectors */}
          <div
            className={css({
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
            })}
          >
            <div
              className={css({
                flex: '1 1 200px',
                minWidth: '200px',
              })}
            >
              <SelectDevice
                kind="audioinput"
                id={audioDeviceId}
                onSubmit={async (id) => {
                  try {
                    saveAudioInputDeviceId(id)
                    if (audioTrack) {
                      await audioTrack.setDeviceId({ exact: id })
                    }
                  } catch (err) {
                    console.error('Failed to switch microphone device', err)
                  }
                }}
              />
            </div>
            {!isSafari() && (
              <div
                className={css({
                  flex: '1 1 200px',
                  minWidth: '200px',
                })}
              >
                <SelectDevice
                  kind="audiooutput"
                  id={audioOutputDeviceId}
                  onSubmit={saveAudioOutputDeviceId}
                />
              </div>
            )}
            <div
              className={css({
                flex: '1 1 200px',
                minWidth: '200px',
              })}
            >
              <SelectDevice
                kind="videoinput"
                id={videoDeviceId}
                onSubmit={async (id) => {
                  try {
                    saveVideoInputDeviceId(id)
                    if (videoTrack) {
                      await videoTrack.setDeviceId({ exact: id })
                    }
                  } catch (err) {
                    console.error('Failed to switch camera device', err)
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Form/Waiting state section */}
        <div
          className={css({
            width: '100%',
            maxWidth: '400px',
          })}
        >
          {renderWaitingState()}
        </div>
      </div>
    </Screen>
  )
}
