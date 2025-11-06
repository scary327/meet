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
  const participants: (RemoteParticipant | LocalParticipant)[] =
    useParticipants();

  const sortedRemoteParticipants = participants
    .slice(1)
    .sort((participantA, participantB) => {
      const nameA = participantA.name || participantA.identity;
      const nameB = participantB.name || participantB.identity;
      return nameA.localeCompare(nameB);
    });

  const sortedParticipants = [
    participants[0], // first participant returned by the hook, is always the local one
    ...sortedRemoteParticipants,
  ];

  useConnectionObserver();

  return (
    <div className="centered-container pt-[72px] px-[12px] w-full">
      <div className="w-full flex gap-x-3 h-[calc(100vh-var(--y-padding))]">
        <CallGrid
          participants={sortedParticipants}
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
