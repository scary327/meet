import type { ReceivedChatMessage } from "@livekit/components-core";
import Typography from "@shared/ui/Typography/Typography";
import { memo, useMemo, type ReactNode } from "react";

interface ChatMessageProps {
  message: ReceivedChatMessage;
  hideMetadata?: boolean;
  messageFormatter?: (message: string) => ReactNode;
}

const MESSAGE_COLORS = {
  MY: "#EFF9FF",
  OTHER: "#F3EFFF",
};

export const ChatMessage = memo(
  ({ message, hideMetadata = false, messageFormatter }: ChatMessageProps) => {
    const formattedMessage = useMemo(() => {
      return messageFormatter
        ? messageFormatter(message.message)
        : message.message;
    }, [message.message, messageFormatter]);

    const time = new Date(message.timestamp);
    const locale = navigator ? navigator.language : "ru-RU";

    return (
      <div
        className="flex flex-col gap-1 p-3 rounded-[2px_12px_12px_12px] max-w-[80%] mt-3"
        title={time.toLocaleTimeString(locale, { timeStyle: "full" })}
        data-lk-message-origin={message.from?.isLocal ? "local" : "remote"}
        style={{
          backgroundColor: message.from?.isLocal
            ? MESSAGE_COLORS.MY
            : MESSAGE_COLORS.OTHER,
          marginLeft: message.from?.isLocal ? "auto" : undefined,
        }}
      >
        {!hideMetadata && (
          <div className="flex gap-2">
            <Typography.Small>
              {message.from?.name ?? message.from?.identity}
            </Typography.Small>
            <Typography.Small className="text-gray-700">
              {time.toLocaleTimeString(locale, { timeStyle: "short" })}
            </Typography.Small>
          </div>
        )}
        <Typography.Body>{formattedMessage}</Typography.Body>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
