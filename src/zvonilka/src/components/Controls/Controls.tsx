import Button from "@shared/ui/Button/Button";
import Microphone from "@shared/icons/mic.svg";
import Camera from "@shared/icons/camera.svg";
import AddUser from "@shared/icons/addUser.svg";
import ChangeBack from "@shared/icons/changeBack.svg";
import Chat from "@shared/icons/chat.svg";
import { memo } from "react";

interface ControlsProps {
  onChatToggle?: () => void;
  onToggleMicrophone?: () => void;
  onToggleCamera?: () => void;
  onAddUser?: () => void;
  isMicEnabled?: boolean;
  isCameraEnabled?: boolean;
}

export const Controls = memo(
  ({
    onChatToggle,
    onToggleMicrophone,
    onToggleCamera,
    onAddUser,
    isMicEnabled = true,
    isCameraEnabled = true,
  }: ControlsProps) => {
    return (
      <div className="flex rounded-[28px] items-center bg-[var(--default-black)]">
        <Button
          variant="secondary"
          shape="circle"
          onClick={onToggleMicrophone}
          title={isMicEnabled ? "Disable microphone" : "Enable microphone"}
          style={{
            opacity: isMicEnabled ? 1 : 0.5,
          }}
        >
          <img src={Microphone} alt="Microphone" draggable={false} />
        </Button>
        <Button
          variant="secondary"
          shape="circle"
          onClick={onToggleCamera}
          title={isCameraEnabled ? "Disable camera" : "Enable camera"}
          style={{
            opacity: isCameraEnabled ? 1 : 0.5,
          }}
        >
          <img src={Camera} alt="Camera" draggable={false} />
        </Button>
        <Button variant="secondary" shape="circle" onClick={onAddUser}>
          <img src={AddUser} alt="Add User" draggable={false} />
        </Button>
        <Button variant="secondary" shape="circle">
          <img src={ChangeBack} alt="Change Background" draggable={false} />
        </Button>
        <Button variant="secondary" shape="circle" onClick={onChatToggle}>
          <img src={Chat} alt="Chat" draggable={false} />
        </Button>
      </div>
    );
  }
);
Controls.displayName = "Controls";
