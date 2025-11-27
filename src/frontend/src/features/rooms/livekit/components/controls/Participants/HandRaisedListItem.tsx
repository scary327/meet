import { css } from '@/styled-system/css'

import { HStack } from '@/styled-system/jsx'
import { Text } from '@/primitives/Text'
import { Avatar } from '@/components/Avatar'
import { useLowerHandParticipant } from '@/features/rooms/api/lowerHandParticipant'
import { getParticipantColor } from '@/features/rooms/utils/getParticipantColor'
import { useIsAdminOrOwner } from '@/features/rooms/livekit/hooks/useIsAdminOrOwner'
import { Participant } from 'livekit-client'
import { isLocal } from '@/utils/livekit'
import { RiHand } from '@remixicon/react'
import { Button } from '@/primitives'

// Русские тексты для компонента
const texts = {
  you: '(Вы)',
  lowerParticipantHand: 'Опустить руку {{name}}',
}

type HandRaisedListItemProps = {
  participant: Participant
}

export const HandRaisedListItem = ({
  participant,
}: HandRaisedListItemProps) => {
  const name = participant.name || participant.identity

  const { lowerHandParticipant } = useLowerHandParticipant()
  const isAdminOrOwner = useIsAdminOrOwner()

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
      key={participant.identity}
      id={participant.identity}
      className={css({
        padding: '0.25rem 0',
        width: 'full',
      })}
    >
      <HStack>
        <Avatar name={name} bgColor={getParticipantColor(participant)} />
        <Text
          variant={'sm'}
          className={css({
            userSelect: 'none',
            cursor: 'default',
            display: 'flex',
          })}
        >
          <span
            className={css({
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px',
              display: 'block',
            })}
          >
            {name}
          </span>
          {isLocal(participant) && (
            <span
              className={css({
                marginLeft: '.25rem',
                whiteSpace: 'nowrap',
              })}
            >
              {texts.you}
            </span>
          )}
        </Text>
      </HStack>
      {isAdminOrOwner && (
        <Button
          square
          variant="greyscale"
          size="xs"
          tooltip={formatText(texts.lowerParticipantHand, { name })}
          aria-label={formatText(texts.lowerParticipantHand, { name })}
          onPress={() => lowerHandParticipant(participant)}
          data-attr="hand-raised-lower"
        >
          <RiHand />
        </Button>
      )}
    </HStack>
  )
}
