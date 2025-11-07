import Typography from "@shared/ui/Typography/Typography";
import { memo, useRef, useEffect, useState, useMemo } from "react";
import SendMessage from "@shared/icons/sendMessage.svg";
import Button from "@shared/ui/Button/Button";
import Close from "@shared/icons/close.svg";
import {
  useChat,
  useParticipants,
  useRoomContext,
  formatChatMessageLinks,
} from "@livekit/components-react";
import type { ChatMessage as ChatMessageType } from "@livekit/components-core";
import { LocalParticipant, RemoteParticipant, RoomEvent } from "livekit-client";
import { ChatMessage } from "./ChatMessage";

interface ChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const Chat = memo(
  ({ isOpen = false, onClose, onUnreadCountChange }: ChatProps) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);

    const room = useRoomContext();
    const { send, chatMessages, isSending } = useChat();
    const participants = useParticipants();

    const [text, setText] = useState("");
    const lastReadMsgAt = useRef<ChatMessageType["timestamp"]>(0);
    const previousMessageCount = useRef(0);

    const handleSubmit = async () => {
      if (!send || !text.trim() || isSending) return;
      await send(text);
      setText("");
      inputRef?.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    useEffect(() => {
      if (!chatMessages || chatMessages.length <= previousMessageCount.current)
        return;
      const msg = chatMessages.slice(-1)[0];
      const from = msg.from as RemoteParticipant | LocalParticipant | undefined;
      room.emit(RoomEvent.ChatMessage, msg, from);
      previousMessageCount.current = chatMessages.length;
    }, [chatMessages, room]);

    useEffect(() => {
      if (chatMessages.length > 0 && ulRef.current) {
        ulRef.current?.scrollTo({ top: ulRef.current.scrollHeight });
      }
    }, [chatMessages]);

    useEffect(() => {
      if (chatMessages.length === 0) {
        return;
      }

      if (
        isOpen &&
        lastReadMsgAt.current !==
          chatMessages[chatMessages.length - 1]?.timestamp
      ) {
        lastReadMsgAt.current =
          chatMessages[chatMessages.length - 1]?.timestamp;
        onUnreadCountChange?.(0);
        return;
      }

      const unreadMessageCount = chatMessages.filter(
        (msg) => !lastReadMsgAt.current || msg.timestamp > lastReadMsgAt.current
      ).length;

      if (unreadMessageCount > 0) {
        onUnreadCountChange?.(unreadMessageCount);
      }
    }, [chatMessages, isOpen, onUnreadCountChange]);

    const renderedMessages = useMemo(() => {
      return chatMessages.map((msg, idx, allMsg) => {
        const hideMetadata =
          idx >= 1 &&
          msg.timestamp - allMsg[idx - 1].timestamp < 60_000 &&
          allMsg[idx - 1].from === msg.from;

        return (
          <ChatMessage
            key={msg.id ?? idx}
            message={msg}
            hideMetadata={hideMetadata}
            messageFormatter={formatChatMessageLinks}
          />
        );
      });
    }, [chatMessages, participants]);

    return (
      <div
        className={`fixed right-0 top-0 h-screen w-100 bg-white border-l-[1px] border-l-[var(--default-black)] rounded-l-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Title */}
        <div className="flex items-center justify-between px-[12px] py-[12px] border-b-[1px] border-b-[var(--default-black)]">
          <Typography.H1 className="!text-[24px] !font-medium !py-0">
            Чат
          </Typography.H1>
          <Button variant="secondary" shape="circle" onClick={onClose}>
            <img src={Close} alt="Close chat" draggable={false} />
          </Button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-auto px-3">
          <ul ref={ulRef} className="list-none">
            {renderedMessages}
          </ul>
        </div>

        {/* Input area */}
        <div className="p-[12px] flex items-center gap-x-1 border-t-[1px] border-t-[var(--default-black)]">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            className="flex-1 resize-none border border-[var(--default-black)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            maxLength={2000}
          />
          <Button
            variant="secondary"
            shape="circle"
            onClick={handleSubmit}
            disabled={!text.trim() || isSending}
          >
            <img src={SendMessage} alt="Send message" className="ml-0.5" />
          </Button>
        </div>
      </div>
    );
  }
);
Chat.displayName = "Chat";
