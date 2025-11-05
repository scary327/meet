import React, { useState } from "react";
import { useParticipants } from "@shared/hooks/useParticipants";
import { useConnectionObserver } from "@shared/hooks/useConnectionObserver";
import CallGrid from "@components/CallGrid/CallGrid";
import { Chat } from "@components/Chat/Chat";

interface RoomContentProps {
  roomId: string;
}

export const RoomContent: React.FC<RoomContentProps> = ({ roomId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const participants = useParticipants();

  useConnectionObserver();

  return (
    <div className="centered-container pt-[72px] px-[12px] w-full">
      <div className="w-full flex gap-x-3 h-[calc(100vh-var(--y-padding))]">
        <CallGrid
          participants={participants}
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
        />
        <Chat
          roomId={roomId}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </div>
    </div>
  );
};
