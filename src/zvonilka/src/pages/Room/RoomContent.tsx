import React, { useState } from "react";
import { useConnectionObserver } from "@shared/hooks/useConnectionObserver";
import CallGrid from "@components/CallGrid/CallGrid";
import { Chat } from "@components/Chat/Chat";
import { useParticipants } from "@livekit/components-react";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";

interface RoomContentProps {
  roomId: string;
}

export const RoomContent: React.FC<RoomContentProps> = ({ roomId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const participants: (RemoteParticipant | LocalParticipant)[] =
    useParticipants();

  const sortedRemoteParticipants = participants
    .slice(1)
    .sort((participantA, participantB) => {
      const nameA = participantA.name || participantA.identity;
      const nameB = participantB.name || participantB.identity;
      return nameA.localeCompare(nameB);
    });

  const sortedParticipants = [participants[0], ...sortedRemoteParticipants];

  useConnectionObserver();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bottomThreshold = 80;
    const isNearBottom = window.innerHeight - e.clientY < bottomThreshold;

    if (isNearBottom) {
      setIsControlsVisible(true);
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
        setHideControlsTimeout(null);
      }
    }
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
    setHideControlsTimeout(timeout);
  };

  return (
    <div
      className="centered-container pt-[72px] px-[12px] w-full h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full flex gap-x-3 h-[calc(100vh-var(--y-padding))]">
        <CallGrid
          participants={sortedParticipants}
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
          isControlsVisible={isControlsVisible}
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
