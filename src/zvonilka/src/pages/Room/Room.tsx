import { useEffect, useMemo } from "react";
import { Logo } from "@components/Logo/Logo";
import { isRoomValid } from "@shared/utils/isRoomValid";
import { useUnifiedRoom } from "@shared/hooks/useUnifiedRoom";
import { usePersistentUserChoices } from "@shared/hooks/usePersistentUserChoices";
import { URLS } from "@app/routes/urls";
import { LiveKitRoom } from "@livekit/components-react";
import { Room as LiveKitRoomClient } from "livekit-client";
import { RoomContent } from "./RoomContent";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "@shared/ui/Loader/Loader";
import { StartMediaButton } from "@components/StartMediaButton/StartMediaButton";

export const Room: React.FC = () => {
  const room = useUnifiedRoom("join");
  const navigate = useNavigate();
  const roomId = useParams().id;
  const { userChoices } = usePersistentUserChoices();

  const livekitRoom = useMemo(
    () => new LiveKitRoomClient(room.roomOptions),
    [room.roomOptions]
  );

  useEffect(() => {
    if (
      room.userProfile?.username === "guest" ||
      (roomId && !isRoomValid(roomId))
    ) {
      navigate(URLS.home);
    }
  }, [room.userProfile?.username, roomId, navigate]);

  useEffect(() => {
    (async () => {
      await room.requestPermissions();
    })();
  }, [room]);

  return (
    <>
      <Logo />
      {room.readyToConnect && room.serverUrl && room.livekitToken ? (
        <LiveKitRoom
          room={livekitRoom}
          serverUrl={room.serverUrl}
          token={room.livekitToken}
          connect={true}
          audio={userChoices.audioEnabled}
          video={userChoices.videoEnabled}
          onDisconnected={() => {
            navigate(URLS.home);
          }}
          connectOptions={{ autoSubscribe: true }}
        >
          <StartMediaButton label="Нажмите для включения звука" />
          <RoomContent roomId={room.roomId} />
        </LiveKitRoom>
      ) : (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Room;
