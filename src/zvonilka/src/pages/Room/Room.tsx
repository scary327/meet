import { useEffect } from "react";
import { Logo } from "@components/Logo/Logo";
import { isRoomValid } from "@shared/utils/isRoomValid";
import { useUnifiedRoom } from "@shared/hooks/useUnifiedRoom";
import { URLS } from "@app/routes/urls";
import { LiveKitRoom } from "@livekit/components-react";
import { RoomContent } from "./RoomContent";

export const Room: React.FC = () => {
  const room = useUnifiedRoom("join");
  const roomId =
    (typeof window !== "undefined"
      ? new URL(window.location.href).pathname.split("/").pop()
      : "") ?? "";

  useEffect(() => {
    if (roomId && !isRoomValid(roomId)) {
      console.warn("Invalid room ID:", roomId);
      window.location.href = URLS.home;
    }
  }, [roomId]);

  useEffect(() => {
    (async () => {
      await room.requestPermissions();
    })();
  }, [room]);

  useEffect(() => {
    console.log("Room state updated:", {
      roomId: room.roomId,
      readyToConnect: room.readyToConnect,
      serverUrl: room.serverUrl,
      hasToken: !!room.livekitToken,
      username: room.userProfile?.username,
    });
  }, [room.roomId, room.readyToConnect, room.serverUrl, room.livekitToken, room.userProfile?.username]);

  return (
    <>
      <Logo />
      {room.readyToConnect && room.serverUrl && room.livekitToken ? (
        <LiveKitRoom
          serverUrl={room.serverUrl}
          token={room.livekitToken}
          connect={true}
          audio={room.userProfile?.audioEnabled}
          video={room.userProfile?.videoEnabled}
        >
          <RoomContent roomId={room.roomId} />
        </LiveKitRoom>
      ) : (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-white text-lg">Подключение к комнате...</div>
        </div>
      )}
    </>
  );
};

export default Room;
