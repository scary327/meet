import { A, Button, Dialog, Div, H, P, Text } from '@/primitives'

import { css } from '@/styled-system/css'
import { useRoomId } from '@/features/rooms/livekit/hooks/useRoomId'
import { useRoomContext } from '@livekit/components-react'
import {
  RecordingMode,
  useIsRecordingTransitioning,
  useStartRecording,
  useStopRecording,
} from '@/features/recording'
import { useEffect, useMemo, useState } from 'react'
import { ConnectionState, RoomEvent } from 'livekit-client'
import { RecordingStatus, recordingStore } from '@/stores/recording'

import {
  NotificationType,
  notifyRecordingSaveInProgress,
  useNotifyParticipants,
} from '@/features/notifications'
import posthog from 'posthog-js'
import { useSnapshot } from 'valtio/index'
import { Spinner } from '@/primitives/Spinner'
import { useConfig } from '@/api/useConfig'
import humanizeDuration from 'humanize-duration'

// Русские тексты для компонента
const texts = {
  start: {
    heading: 'Записать этот звонок',
    body: 'Записать этот звонок для просмотра позже {{duration_message}} и получить видеозапись по электронной почте.',
    button: 'Начать запись',
    loading: 'Запись начинается',
    linkMore: 'Узнать больше',
  },
  notAdminOrOwner: {
    heading: 'Ограниченный доступ',
    body: 'По соображениям безопасности только создатель встречи или администратор может начать запись (бета).',
    linkMore: 'Узнать больше',
  },
  stopping: {
    heading: 'Сохранение ваших данных…',
    body: 'Вы можете покинуть встречу, если хотите; запись завершится автоматически.',
  },
  stop: {
    heading: 'Запись в процессе…',
    body: 'Вы получите результат по электронной почте после завершения записи.',
    button: 'Остановить запись',
  },
  alert: {
    title: 'Ошибка записи',
    body: {
      stop: 'Не удалось остановить запись. Пожалуйста, попробуйте еще раз через некоторое время.',
      start: 'Не удалось начать запись. Пожалуйста, попробуйте еще раз через некоторое время.',
    },
    button: 'OK',
  },
  durationMessage: '(ограничено до {{max_duration}}) ',
}

export const ScreenRecordingSidePanel = () => {
  const { data } = useConfig()
  const [isLoading, setIsLoading] = useState(false)
  const recordingSnap = useSnapshot(recordingStore)

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState('')

  const { notifyParticipants } = useNotifyParticipants()

  const roomId = useRoomId()

  const { mutateAsync: startRecordingRoom, isPending: isPendingToStart } =
    useStartRecording({
      onError: () => setIsErrorDialogOpen('start'),
    })
  const { mutateAsync: stopRecordingRoom, isPending: isPendingToStop } =
    useStopRecording({
      onError: () => setIsErrorDialogOpen('stop'),
    })

  const statuses = useMemo(() => {
    return {
      isAnotherModeStarted:
        recordingSnap.status == RecordingStatus.TRANSCRIPT_STARTED,
      isStarting:
        recordingSnap.status == RecordingStatus.SCREEN_RECORDING_STARTING,
      isStarted:
        recordingSnap.status == RecordingStatus.SCREEN_RECORDING_STARTED,
      isStopping:
        recordingSnap.status == RecordingStatus.SCREEN_RECORDING_STOPPING,
    }
  }, [recordingSnap])

  const room = useRoomContext()
  const isRoomConnected = room.state == ConnectionState.Connected
  const isRecordingTransitioning = useIsRecordingTransitioning()

  useEffect(() => {
    const handleRecordingStatusChanged = () => {
      setIsLoading(false)
    }
    room.on(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged)
    return () => {
      room.off(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged)
    }
  }, [room])

  const handleScreenRecording = async () => {
    if (!roomId) {
      console.warn('No room ID found')
      return
    }
    try {
      setIsLoading(true)
      if (room.isRecording) {
        await stopRecordingRoom({ id: roomId })
        recordingStore.status = RecordingStatus.SCREEN_RECORDING_STOPPING
        await notifyParticipants({
          type: NotificationType.ScreenRecordingStopped,
        })
        notifyRecordingSaveInProgress(
          RecordingMode.ScreenRecording,
          room.localParticipant
        )
      } else {
        await startRecordingRoom({
          id: roomId,
          mode: RecordingMode.ScreenRecording,
        })
        recordingStore.status = RecordingStatus.SCREEN_RECORDING_STARTING
        await notifyParticipants({
          type: NotificationType.ScreenRecordingStarted,
        })
        posthog.capture('screen-recording-started', {})
      }
    } catch (error) {
      console.error('Failed to handle transcript:', error)
      setIsLoading(false)
    }
  }

  const isDisabled = useMemo(
    () =>
      isLoading ||
      isRecordingTransitioning ||
      statuses.isAnotherModeStarted ||
      !isRoomConnected,
    [isLoading, isRecordingTransitioning, statuses, isRoomConnected]
  )

  // Функция для форматирования текста с переменными
  const formatText = (text: string, vars: Record<string, string>) => {
    let result = text
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, value)
    })
    return result
  }

  return (
    <Div
      display="flex"
      overflowY="scroll"
      padding="0 1.5rem"
      flexGrow={1}
      flexDirection="column"
      alignItems="center"
    >
      <img
        src="/assets/intro-slider/4.png"
        alt={''}
        className={css({
          minHeight: '309px',
          marginBottom: '1rem',
        })}
      />

      {statuses.isStarted ? (
        <>
          <H lvl={3} margin={false}>
            {texts.stop.heading}
          </H>
          <Text
            variant="note"
            wrap={'pretty'}
            centered
            className={css({
              textStyle: 'sm',
              marginBottom: '2.5rem',
              marginTop: '0.25rem',
            })}
          >
            {texts.stop.body}
          </Text>
          <Button
            isDisabled={isDisabled}
            onPress={() => handleScreenRecording()}
            data-attr="stop-screen-recording"
            size="sm"
            variant="tertiary"
          >
            {texts.stop.button}
          </Button>
        </>
      ) : (
        <>
          {statuses.isStopping || isPendingToStop ? (
            <>
              <H lvl={3} margin={false}>
                {texts.stopping.heading}
              </H>
              <Text
                variant="note"
                wrap={'pretty'}
                centered
                className={css({
                  textStyle: 'sm',
                  maxWidth: '90%',
                  marginBottom: '2.5rem',
                  marginTop: '0.25rem',
                })}
              >
                {texts.stopping.body}
              </Text>
              <Spinner />
            </>
          ) : (
            <>
              <H lvl={3} margin={false}>
                {texts.start.heading}
              </H>
              <Text
                variant="note"
                wrap="balance"
                centered
                className={css({
                  textStyle: 'sm',
                  maxWidth: '90%',
                  marginBottom: '2.5rem',
                  marginTop: '0.25rem',
                })}
              >
                {formatText(texts.start.body, {
                  duration_message: data?.recording?.max_duration
                    ? formatText(texts.durationMessage, {
                        max_duration: humanizeDuration(
                          data?.recording?.max_duration,
                          {
                            language: 'ru',
                          }
                        ),
                      })
                    : '',
                })}{' '}
                {data?.support?.help_article_recording && (
                  <A href={data.support.help_article_recording} target="_blank">
                    {texts.start.linkMore}
                  </A>
                )}
              </Text>
              <Button
                isDisabled={isDisabled}
                onPress={() => handleScreenRecording()}
                data-attr="start-screen-recording"
                size="sm"
                variant="tertiary"
              >
                {statuses.isStarting || isPendingToStart ? (
                  <>
                    <Spinner size={20} />
                    {texts.start.loading}
                  </>
                ) : (
                  texts.start.button
                )}
              </Button>
            </>
          )}
        </>
      )}
      <Dialog
        isOpen={!!isErrorDialogOpen}
        role="alertdialog"
        aria-label={texts.alert.title}
      >
        <P>{isErrorDialogOpen === 'stop' ? texts.alert.body.stop : texts.alert.body.start}</P>
        <Button
          variant="text"
          size="sm"
          onPress={() => setIsErrorDialogOpen('')}
        >
          {texts.alert.button}
        </Button>
      </Dialog>
    </Div>
  )
}
