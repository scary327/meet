import Button from "@shared/ui/Button/Button";
import Microphone from "@shared/icons/mic.svg";
import Camera from "@shared/icons/camera.svg";
import AddUser from "@shared/icons/addUser.svg";
import ChangeBack from "@shared/icons/changeBack.svg";
import Chat from "@shared/icons/chat.svg";
import ArrowUp from "@shared/icons/arrowUp.svg";
import Speaker from "@shared/icons/speaker.svg";
import { memo, useState } from "react";
import { DeviceMenu } from "@components/DeviceMenu/DeviceMenu";
import { useMediaDevices } from "@shared/hooks/useMediaDevices";

interface ControlsProps {
  onChatToggle?: () => void;
  onToggleMicrophone?: () => void;
  onToggleCamera?: () => void;
  onAddUser?: () => void;
  isMicEnabled?: boolean;
  isCameraEnabled?: boolean;
  onSelectAudioInput?: (deviceId: string) => void;
  onSelectAudioOutput?: (deviceId: string) => void;
  onSelectVideoInput?: (deviceId: string) => void;
  selectedAudioInputId?: string;
  selectedAudioOutputId?: string;
  selectedVideoInputId?: string;
}

export const Controls = memo(
  ({
    onChatToggle,
    onToggleMicrophone,
    onToggleCamera,
    onAddUser,
    isMicEnabled = true,
    isCameraEnabled = true,
    onSelectAudioInput,
    onSelectAudioOutput,
    onSelectVideoInput,
    selectedAudioInputId,
    selectedAudioOutputId,
    selectedVideoInputId,
  }: ControlsProps) => {
    const [audioInputMenuOpen, setAudioInputMenuOpen] = useState(false);
    const [audioOutputMenuOpen, setAudioOutputMenuOpen] = useState(false);
    const [videoInputMenuOpen, setVideoInputMenuOpen] = useState(false);

    const { audioInputDevices, audioOutputDevices, videoInputDevices } =
      useMediaDevices();

    return (
      <div className="flex rounded-[28px] items-center bg-[var(--default-black)] gap-1">
        {/* Microphone with dropdown */}
        <div className="relative flex">
          <Button
            variant="secondary"
            shape="circle"
            onClick={onToggleMicrophone}
            title={isMicEnabled ? "Disable microphone" : "Enable microphone"}
            style={{
              opacity: isMicEnabled ? 1 : 0.5,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <img src={Microphone} alt="Microphone" draggable={false} />
          </Button>
          <Button
            variant="secondary"
            shape="circle"
            onClick={() => setAudioInputMenuOpen(!audioInputMenuOpen)}
            title="Select microphone"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingLeft: "8px",
              paddingRight: "8px",
              minWidth: "auto",
            }}
          >
            <img
              src={ArrowUp}
              alt="Select"
              draggable={false}
              style={{ transform: "rotate(-90deg)" }}
            />
          </Button>
          <DeviceMenu
            devices={audioInputDevices}
            selectedDeviceId={selectedAudioInputId}
            onSelectDevice={(deviceId) => onSelectAudioInput?.(deviceId)}
            isOpen={audioInputMenuOpen}
            onClose={() => setAudioInputMenuOpen(false)}
          />
        </div>

        <div className="relative flex">
          <Button
            variant="secondary"
            shape="circle"
            onClick={() => setAudioOutputMenuOpen(!audioOutputMenuOpen)}
            title="Select speaker"
          >
            <img src={Speaker} alt="Speaker" draggable={false} />
          </Button>
          <DeviceMenu
            devices={audioOutputDevices}
            selectedDeviceId={selectedAudioOutputId}
            onSelectDevice={(deviceId) => onSelectAudioOutput?.(deviceId)}
            isOpen={audioOutputMenuOpen}
            onClose={() => setAudioOutputMenuOpen(false)}
          />
        </div>

        <div className="relative flex">
          <Button
            variant="secondary"
            shape="circle"
            onClick={onToggleCamera}
            title={isCameraEnabled ? "Disable camera" : "Enable camera"}
            style={{
              opacity: isCameraEnabled ? 1 : 0.5,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <img src={Camera} alt="Camera" draggable={false} />
          </Button>
          <Button
            variant="secondary"
            shape="circle"
            onClick={() => setVideoInputMenuOpen(!videoInputMenuOpen)}
            title="Select camera"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingLeft: "8px",
              paddingRight: "8px",
              minWidth: "auto",
            }}
          >
            <img
              src={ArrowUp}
              alt="Select"
              draggable={false}
              style={{ transform: "rotate(-90deg)" }}
            />
          </Button>
          <DeviceMenu
            devices={videoInputDevices}
            selectedDeviceId={selectedVideoInputId}
            onSelectDevice={(deviceId) => onSelectVideoInput?.(deviceId)}
            isOpen={videoInputMenuOpen}
            onClose={() => setVideoInputMenuOpen(false)}
          />
        </div>

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
