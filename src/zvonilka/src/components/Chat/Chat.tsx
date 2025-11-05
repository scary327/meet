import Input from "@shared/ui/Input/Input";
import Typography from "@shared/ui/Typography/Typography";
import { memo } from "react";
import SendMessage from "@shared/icons/sendMessage.svg";
import Button from "@shared/ui/Button/Button";
import Close from "@shared/icons/close.svg";

interface ChatProps {
  roomId: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Chat = memo(({ roomId, isOpen = false, onClose }: ChatProps) => {
  return (
    <div
      className={`fixed right-0 top-0 h-screen w-100 bg-white border-l-[1px] border-l-[var(--default-black)] rounded-l-xl flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-[12px] py-[12px] border-b-[1px] border-b-[var(--default-black)]">
        <Typography.H1 className="!text-[24px] !font-medium !py-0">
          Чат
        </Typography.H1>
        <Button variant="secondary" shape="circle" onClick={onClose}>
          <img src={Close} alt="Close chat" draggable={false} />
        </Button>
      </div>
      <div className="flex-1 overflow-auto"></div>
      <div className="p-[12px] flex items-center gap-x-1 border-t-[1px] border-t-[var(--default-black)]">
        <Input variant="chat" className="w-full" />
        <Button variant="secondary" shape="circle">
          <img src={SendMessage} alt="Send message" className="ml-0.5" />
        </Button>
      </div>
    </div>
  );
});
Chat.displayName = "Chat";
