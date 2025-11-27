import { A, Button, Dialog, Div, H, LinkButton, P, Text } from '@/primitives'

import { css } from '@/styled-system/css'
import { useRoomId } from '@/features/rooms/livekit/hooks/useRoomId'
import { useRoomContext } from '@livekit/components-react'
import {
  RecordingMode,
  useHasRecordingAccess,
  useIsRecordingTransitioning,
  useStartRecording,
  useStopRecording,
  useHasFeatureWithoutAdminRights,
} from '../index'
import { useEffect, useMemo, useState } from 'react'
import { ConnectionState, RoomEvent } from 'livekit-client'
import { RecordingStatus, recordingStore } from '@/stores/recording'
import { FeatureFlags } from '@/features/analytics/enums'
import {
  NotificationType,
  useNotifyParticipants,
  notifyRecordingSaveInProgress,
} from '@/features/notifications'
import posthog from 'posthog-js'
import { useSnapshot } from 'valtio/index'
import { Spinner } from '@/primitives/Spinner'
import { useConfig } from '@/api/useConfig'
import humanizeDuration from 'humanize-duration'

// Русские тексты для компонента
const texts = {
  start: {
    heading: 'Транскрибировать этот звонок',
    body: 'Автоматически транскрибировать этот звонок {{duration_message}} и получить резюме в Документах.',
    button: 'Начать транскрипцию',
    loading: 'Запуск транскрипции',
    linkMore: 'Узнать больше',
  },
  notAdminOrOwner: {
    heading: 'Ограниченный доступ',
    body: 'По соображениям безопасности только создатель встречи или администратор может начать транскрипцию (бета).',
    linkMore: 'Узнать больше',
  },
  stop: {
    heading: 'Транскрипция в процессе...',
    body: 'Транскрипция вашей встречи в процессе. Вы получите результат по электронной почте после завершения встречи.',
    button: 'Остановить транскрипцию',
  },
  stopping: {
    heading: 'Сохранение ваших данных…',
    body: 'Вы можете покинуть встречу, если хотите; запись завершится автоматически.',
  },
  beta: {
    heading: 'Стать бета-тестером',
    body: 'Записывайте встречу для последующего просмотра. Вы получите резюме по электронной почте после завершения встречи.',
    button: 'Зарегистрироваться',
  },
  alert: {
    title: 'Ошибка транскрипции',
    body: {
      stop: 'Не удалось остановить транскрипцию. Пожалуйста, попробуйте еще раз через некоторое время.',
      start: 'Не удалось начать транскрипцию. Пожалуйста, попробуйте еще раз через некоторое время.',
    },
    button: 'OK',
  },
  durationMessage: '(ограничено до {{max_duration}}) ',
}

export const TranscriptSidePanel = () => {
  const { data } = useConfig()

  const [isLoading, setIsLoading] = useState(false)

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState('')

  const recordingSnap = useSnapshot(recordingStore)

  const { notifyParticipants } = useNotifyParticipants()

  const hasTranscriptAccess = useHasRecordingAccess(
    RecordingMode.Transcript,
    FeatureFlags.Transcript
  )

  const hasFeatureWithoutAdminRights = useHasFeatureWithoutAdminRights(
    RecordingMode.Transcript,
    FeatureFlags.Transcript
  )

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
        recordingSnap.status == RecordingStatus.SCREEN_RECORDING_STARTED,
      isStarting: recordingSnap.status == RecordingStatus.TRANSCRIPT_STARTING,
      isStarted: recordingSnap.status == RecordingStatus.TRANSCRIPT_STARTED,
      isStopping: recordingSnap.status == RecordingStatus.TRANSCRIPT_STOPPING,
    }
  }, [recordingSnap])

  const isRecordingTransitioning = useIsRecordingTransitioning()

  const room = useRoomContext()
  const isRoomConnected = room.state == ConnectionState.Connected

  useEffect(() => {
    const handleRecordingStatusChanged = () => {
      setIsLoading(false)
    }
    room.on(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged)
    return () => {
      room.off(RoomEvent.RecordingStatusChanged, handleRecordingStatusChanged)
    }
  }, [room])

  const handleTranscript = async () => {
    if (!roomId) {
      console.warn('No room ID found')
      return
    }
    try {
      setIsLoading(true)
      if (room.isRecording) {
        await stopRecordingRoom({ id: roomId })
        recordingStore.status = RecordingStatus.TRANSCRIPT_STOPPING
        await notifyParticipants({
          type: NotificationType.TranscriptionStopped,
        })
        notifyRecordingSaveInProgress(
          RecordingMode.Transcript,
          room.localParticipant
        )
      } else {
        await startRecordingRoom({ id: roomId, mode: RecordingMode.Transcript })
        recordingStore.status = RecordingStatus.TRANSCRIPT_STARTING
        await notifyParticipants({
          type: NotificationType.TranscriptionStarted,
        })
        posthog.capture('transcript-started', {})
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
        src="/assets/intro-slider/3.png"
        alt={''}
        className={css({
          minHeight: '309px',
          marginBottom: '1rem',
        })}
      />
      {!hasTranscriptAccess ? (
        <>
          {hasFeatureWithoutAdminRights ? (
            <>
              <Text>{texts.notAdminOrOwner.heading}</Text>
              <Text
                variant="note"
                wrap="balance"
                centered
                className={css({
                  textStyle: 'sm',
                  marginBottom: '2.5rem',
                  marginTop: '0.25rem',
                })}
              >
                {texts.notAdminOrOwner.body}
                <br />
                {data?.support?.help_article_transcript && (
                  <A
                    href={data.support.help_article_transcript}
                    target="_blank"
                  >
                    {texts.notAdminOrOwner.linkMore}
                  </A>
                )}
              </Text>
            </>
          ) : (
            <>
              <Text>{texts.beta.heading}</Text>
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
                {texts.beta.body}{' '}
                {data?.support?.help_article_transcript && (
                  <A
                    href={data.support.help_article_transcript}
                    target="_blank"
                  >
                    {texts.start.linkMore}
                  </A>
                )}
              </Text>
              {data?.transcript.form_beta_users && (
                <LinkButton
                  size="sm"
                  variant="tertiary"
                  href={data?.transcript.form_beta_users}
                  target="_blank"
                >
                  {texts.beta.button}
                </LinkButton>
              )}
            </>
          )}
        </>
      ) : (
        <>
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
                onPress={() => handleTranscript()}
                data-attr="stop-transcript"
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
                    {data?.support?.help_article_transcript && (
                      <A
                        href={data.support.help_article_transcript}
                        target="_blank"
                      >
                        {texts.start.linkMore}
                      </A>
                    )}
                  </Text>
                  <Button
                    isDisabled={isDisabled}
                    onPress={() => handleTranscript()}
                    data-attr="start-transcript"
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
