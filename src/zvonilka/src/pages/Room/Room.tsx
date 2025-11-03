import { URLS } from "@app/routes/urls";
import CallGrid from "@components/CallGrid/CallGrid";
import { Chat } from "@components/Chat/Chat";
import { Controls } from "@components/Controls/Controls";
import { Logo } from "@components/Logo/Logo";
import { isRoomValid } from "@shared/utils/isRoomValid";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId && !isRoomValid(roomId)) {
      console.warn("Invalid room ID:", roomId);
      navigate(URLS.home);
    }
  }, [roomId]);

  return (
    <>
      <Logo />
      <Controls />
      <div className="centered-container pt-[72px] px-[12px] w-full">
        <div className="w-full grid grid-cols-[2fr_1fr] gap-x-3">
          <CallGrid />
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Room;
