import React, { useEffect, useState } from "react";
import { Logo } from "@components/Logo/Logo";
import { Chat } from "@components/Chat/Chat";
import { Controls } from "@components/Controls/Controls";
import { isRoomValid } from "@shared/utils/isRoomValid";
import { useUnifiedRoom } from "@shared/hooks/useUnifiedRoom";
import { URLS } from "@app/routes/urls";
import CallGrid from "@components/CallGrid/CallGrid";
import { LiveKitRoom } from "@livekit/components-react";

export const Room: React.FC = () => {
  const room = useUnifiedRoom("join");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const roomId =
    (typeof window !== "undefined"
      ? new URL(window.location.href).pathname.split("/").pop()
      : "") ?? "";

  // const participants = useListWaitingParticipants(roomId);

  useEffect(() => {
    if (roomId && !isRoomValid(roomId)) {
      console.warn("Invalid room ID:", roomId);
      window.location.href = URLS.home;
    }
  }, [roomId]);

  // Запрос разрешений (мгновенный запуск после монтирования)
  useEffect(() => {
    (async () => {
      await room.requestPermissions();
    })();
  }, [room]);

  return (
    <>
      <Logo />
      <LiveKitRoom
        serverUrl={room.serverUrl}
        token={room.livekitToken}
        connect={room.readyToConnect}
      >
        <div className="centered-container pt-[72px] px-[12px] w-full">
          <div className="w-full flex gap-x-3 h-[calc(100vh-var(--y-padding))]">
            <CallGrid participants={[]} onChatToggle={() => setIsChatOpen(!isChatOpen)} />
            <Chat roomId={room.roomId} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      </LiveKitRoom>
    </>
  );
};

export default Room;
