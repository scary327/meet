import { useEffect } from "react";
import { Logo } from "@components/Logo/Logo";
import { isRoomValid } from "@shared/utils/isRoomValid";
import { useUnifiedRoom } from "@shared/hooks/useUnifiedRoom";
import { URLS } from "@app/routes/urls";
import { LiveKitRoom } from "@livekit/components-react";
import { RoomContent } from "./RoomContent";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "@shared/ui/Loader/Loader";

export const Room: React.FC = () => {
  const room = useUnifiedRoom("join");
  const navigate = useNavigate();
  const roomId = useParams().id;

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
          <Loader />
        </div>
      )}
    </>
  );
};

export default Room;
