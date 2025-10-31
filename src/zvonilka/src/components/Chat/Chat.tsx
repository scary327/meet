import Input from "@shared/ui/Input/Input";
import Typography from "@shared/ui/Typography/Typography";
import { memo } from "react";
import SendMessage from "@shared/icons/sendMessage.svg";
import Button from "@shared/ui/Button/Button";

export const Chat = memo(() => {
  return (
    <div className="h-[calc(100vh-var(--y-padding))] flex flex-col items-center border-[1px] border-[var(--default-black)] rounded-xl">
      <Typography.H1 className="!text-[32px] !font-medium !py-[12px] w-full border-b-[1px] border-b-[var(--default-black)] text-center rounded-xl">
        Чат
      </Typography.H1>
      <div className="h-full"></div>
      <div className="p-[12px] flex items-center gap-x-1 w-full border-t-[1px] border-t-[var(--default-black)] rounded-xl">
        <Input variant="chat" className="w-full" />
        <Button variant="secondary" shape="circle">
          <img src={SendMessage} alt="Send message" className="ml-0.5" />
        </Button>
      </div>
    </div>
  );
});
Chat.displayName = "Chat";
