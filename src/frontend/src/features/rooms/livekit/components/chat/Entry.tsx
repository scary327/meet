import type { ReceivedChatMessage } from '@livekit/components-core'
import * as React from 'react'
import { css } from '@/styled-system/css'
import { Text } from '@/primitives'
import { MessageFormatter } from '@livekit/components-react'

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  entry: ReceivedChatMessage
  hideMetadata?: boolean
  messageFormatter?: MessageFormatter
}

const MESSAGE_COLORS = {
  MY: '#EFF9FF',
  OTHER: '#F3EFFF',
}

export const ChatEntry: (
  props: ChatEntryProps & React.RefAttributes<HTMLLIElement>
) => React.ReactNode = /* @__PURE__ */ React.forwardRef<
  HTMLLIElement,
  ChatEntryProps
>(function ChatEntry(
  { entry, hideMetadata = false, messageFormatter, ...props }: ChatEntryProps,
  ref
) {
  const formattedMessage = React.useMemo(() => {
    return messageFormatter ? messageFormatter(entry.message) : entry.message
  }, [entry.message, messageFormatter])
  const time = new Date(entry.timestamp)
  const locale = navigator ? navigator.language : 'ru-RU'

  return (
    <li
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0.75rem',
        borderRadius: '2px 12px 12px 12px',
        maxWidth: '80%',
        marginTop: '0.75rem',
        marginLeft: entry.from?.isLocal ? 'auto' : undefined,
      })}
      style={{
        backgroundColor: entry.from?.isLocal
          ? MESSAGE_COLORS.MY
          : MESSAGE_COLORS.OTHER,
      }}
      ref={ref}
      title={time.toLocaleTimeString(locale, { timeStyle: 'full' })}
      data-lk-message-origin={entry.from?.isLocal ? 'local' : 'remote'}
      {...props}
    >
      {!hideMetadata && (
        <span
          className={css({
            display: 'flex',
            gap: '0.5rem',
          })}
        >
          <Text bold={true} variant="sm">
            {entry.from?.name ?? entry.from?.identity}
          </Text>
          <Text variant="sm" className={css({ color: 'gray.700' })}>
            {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
          </Text>
        </span>
      )}
      <Text
        variant="sm"
        margin={false}
        className={css({
          whiteSpace: 'pre-wrap',
          '& .lk-chat-link': {
            color: 'blue',
            textDecoration: 'underline',
          },
        })}
      >
        {formattedMessage}
      </Text>
    </li>
  )
})
