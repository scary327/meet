import { Div, Field, H, Text } from '@/primitives'
import { css } from '@/styled-system/css'
import { Separator as RACSeparator } from 'react-aria-components'
// import { useTranslation } from 'react-i18next'
import { usePatchRoom } from '@/features/rooms/api/patchRoom'
import { fetchRoom } from '@/features/rooms/api/fetchRoom'
import { ApiAccessLevel } from '@/features/rooms/api/ApiRoom'
import { queryClient } from '@/api/queryClient'
import { keys } from '@/api/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'wouter'
import { usePublishSourcesManager } from '@/features/rooms/livekit/hooks/usePublishSourcesManager'

export const Admin = () => {
  // const { t } = useTranslation('rooms', { keyPrefix: 'admin' })

  const { roomId } = useParams()

  if (!roomId) {
    throw new Error()
  }

  const { mutateAsync: patchRoom } = usePatchRoom()

  const { data: readOnlyData } = useQuery({
    queryKey: [keys.room, roomId],
    queryFn: () => fetchRoom({ roomId }),
    retry: false,
    enabled: false,
  })

  const {
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
  } = usePublishSourcesManager()

  return (
    <Div
      display="flex"
      overflowY="scroll"
      padding="0 1.5rem"
      flexGrow={1}
      flexDirection="column"
      alignItems="start"
    >
      <Text
        variant="note"
        wrap="pretty"
        className={css({
          textStyle: 'sm',
        })}
        margin={'md'}
      >
        Эти настройки организатора позволяют вам контролировать встречу. Только
        организаторы имеют доступ к этим элементам управления.
      </Text>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        <RACSeparator
          className={css({
            border: 'none',
            height: '1px',
            width: '100%',
            background: 'greyscale.250',
          })}
        />
        <H
          lvl={2}
          className={css({
            fontWeight: 500,
          })}
          margin="sm"
        >
          Модерирование встречи
        </H>
        <Text
          variant="note"
          wrap="balance"
          className={css({
            textStyle: 'sm',
          })}
          margin={'md'}
        >
          Эти параметры ограничивают действия участников во время встречи.
        </Text>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          })}
        >
          <Field
            type="switch"
            label="Включить микрофон"
            description=""
            isSelected={isMicrophoneEnabled}
            onChange={toggleMicrophone}
            wrapperProps={{
              noMargin: true,
              fullWidth: true,
            }}
          />
          <Field
            type="switch"
            label="Включить видео"
            description=""
            isSelected={isCameraEnabled}
            onChange={toggleCamera}
            wrapperProps={{
              noMargin: true,
              fullWidth: true,
            }}
          />
          <Field
            type="switch"
            label="Поделиться экраном"
            description="Отключение этой опции помешает участникам делиться экраном, и любой текущий скриншер будет остановлен немедленно."
            isSelected={isScreenShareEnabled}
            onChange={toggleScreenShare}
            wrapperProps={{
              noMargin: true,
              fullWidth: true,
            }}
          />
        </div>
      </div>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1rem',
        })}
      >
        <RACSeparator
          className={css({
            border: 'none',
            height: '1px',
            width: '100%',
            background: 'greyscale.250',
          })}
        />
        <H
          lvl={2}
          className={css({
            fontWeight: 500,
          })}
          margin="sm"
        >
          Доступ к комнате
        </H>
        <Text
          variant="note"
          wrap="balance"
          className={css({
            textStyle: 'sm',
          })}
          margin={'md'}
        >
          Эти параметры также будут применяться к будущим событиям этой встречи.
        </Text>
        <Field
          type="radioGroup"
          label="Типы доступа к встрече"
          aria-label="Типы доступа к встрече"
          labelProps={{
            className: css({
              fontSize: '1rem',
              paddingBottom: '1rem',
            }),
          }}
          value={readOnlyData?.access_level}
          onChange={(value) =>
            patchRoom({
              roomId,
              room: { access_level: value as ApiAccessLevel },
            })
              .then((room) => {
                queryClient.setQueryData([keys.room, roomId], room)
              })
              .catch((e) => console.error(e))
          }
          items={[
            {
              value: ApiAccessLevel.PUBLIC,
              label: 'Открытая',
              description:
                'Никому не нужно запрашивать присоединение к встрече.',
            },
            {
              value: ApiAccessLevel.TRUSTED,
              label: 'Открыто для доверенных лиц',
              description:
                'Аутентифицированные люди не должны запрашивать присоединение к встрече.',
            },
            {
              value: ApiAccessLevel.RESTRICTED,
              label: 'Ограниченная',
              description:
                'Люди, которые не были приглашены на встречу, должны запросить присоединение.',
            },
          ]}
        />
      </div>
    </Div>
  )
}
