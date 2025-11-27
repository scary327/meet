import { Button, Text } from '@/primitives'
import { HStack } from '@/styled-system/jsx'
import { css } from '@/styled-system/css'
import { Avatar } from '@/components/Avatar'
import { WaitingParticipant } from '@/features/rooms/api/listWaitingParticipants'
import { RiCloseLine } from '@remixicon/react'

// Русские тексты для компонента
const texts = {
  waiting: {
    accept: {
      button: 'Принять',
      label: 'Принять {{name}} на встречу',
    },
    deny: {
      button: 'Отклонить',
      label: 'Отклонить {{name}} от встречи',
    },
  },
}

export const WaitingParticipantListItem = ({
  participant,
  onAction,
}: {
  participant: WaitingParticipant
  onAction: (participant: WaitingParticipant, allowEntry: boolean) => void
}) => {
  const formatText = (text: string, vars: Record<string, string>) => {
    let result = text
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, value)
    })
    return result
  }

  return (
    <HStack
      role="listitem"
      justify="space-between"
      key={participant.id}
      id={participant.id}
      className={css({
        padding: '0.25rem 0',
        width: 'full',
      })}
    >
      <HStack
        className={css({
          flex: '1',
          minWidth: '0',
        })}
      >
        <Avatar name={participant.username} bgColor={participant.color} />
        <Text
          variant={'sm'}
          className={css({
            userSelect: 'none',
            cursor: 'default',
            display: 'flex',
            flex: '1',
            minWidth: '0',
          })}
        >
          <span
            className={css({
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              display: 'block',
            })}
          >
            {participant.username}
          </span>
        </Text>
      </HStack>
      <HStack
        gap="0.25rem"
        className={css({
          flexShrink: '0',
        })}
      >
        <Button
          size="sm"
          variant="secondary"
          onPress={() => onAction(participant, true)}
          aria-label={formatText(texts.waiting.accept.label, {
            name: participant.username,
          })}
          data-attr="participants-accept"
        >
          {texts.waiting.accept.button}
        </Button>
        <Button
          size="sm"
          square
          tooltip={texts.waiting.deny.button}
          variant="primaryDark"
          onPress={() => onAction(participant, false)}
          aria-label={formatText(texts.waiting.deny.label, {
            name: participant.username,
          })}
          data-attr="participants-deny"
        >
          <RiCloseLine />
        </Button>
      </HStack>
    </HStack>
  )
}
