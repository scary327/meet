import React, { useCallback, useMemo } from "react";
import UserCard from "./UserCard";
import { Controls } from "@components/Controls/Controls";
import { useToast } from "@shared/hooks/useToast";
import { usePersistentUserChoices } from "@shared/hooks/usePersistentUserChoices";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import { useTrackToggle, useRoomContext } from "@livekit/components-react";
import { Track } from "livekit-client";

interface IDevices {
  audioInput?: string;
  audioOutput?: string;
  videoInput?: string;
}

interface CallGridProps {
  participants: (RemoteParticipant | LocalParticipant)[];
  onChatToggle?: () => void;
  isControlsVisible?: boolean;
}

export const CallGrid: React.FC<CallGridProps> = ({
  participants,
  onChatToggle,
  isControlsVisible = false,
}) => {
  const room = useRoomContext();
  const { showToast } = useToast();
  const { saveAudioInputEnabled, saveVideoInputEnabled } =
    usePersistentUserChoices();

  const onMicrophoneChange = useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled]
  );

  const micTrackProps = useTrackToggle({
    source: Track.Source.Microphone,
    onChange: onMicrophoneChange,
  });

  const onCameraChange = useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled]
  );

  const cameraTrackProps = useTrackToggle({
    source: Track.Source.Camera,
    onChange: onCameraChange,
  });

  const handleToggleMicrophone = async () => {
    await micTrackProps.toggle();
  };

  const handleToggleCamera = async () => {
    await cameraTrackProps.toggle();
  };

  const handleCopyMeetLink = async () => {
    const meetLink = window.location.href;
    try {
      await navigator.clipboard.writeText(meetLink);
      showToast("Ссылка на комнату скопирована");
    } catch (error) {
      console.error("Failed to copy meet link:", error);
      showToast("Ошибка при копировании ссылки");
    }
  };

  const handleSelectAudioInput = async (deviceId: string) => {
    try {
      await room.switchActiveDevice("audioinput", deviceId);
      showToast("Микрофон изменён");
    } catch (error) {
      console.error("Failed to change audio input:", error);
      showToast("Ошибка при смене микрофона");
    }
  };

  const handleSelectAudioOutput = async (deviceId: string) => {
    try {
      await room.switchActiveDevice("audiooutput", deviceId);
      showToast("Динамик изменён");
    } catch (error) {
      console.error("Failed to change audio output:", error);
      showToast("Ошибка при смене динамика");
    }
  };

  const handleSelectVideoInput = async (deviceId: string) => {
    try {
      await room.switchActiveDevice("videoinput", deviceId);
      showToast("Камера изменена");
    } catch (error) {
      console.error("Failed to change video input:", error);
      showToast("Ошибка при смене камеры");
    }
  };

  const currentDevices: IDevices = useMemo(
    () => ({
      audioInput: room.getActiveDevice("audioinput") || undefined,
      audioOutput: room.getActiveDevice("audiooutput") || undefined,
      videoInput: room.getActiveDevice("videoinput") || undefined,
    }),
    [room]
  );

  return (
    <div className="flex-1 relative bg-[var(--default-black)] rounded-xl overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-6 items-stretch justify-items-center flex-1 overflow-auto">
        {participants.map((p) => (
          <UserCard key={p.identity} participant={p} />
        ))}
      </div>
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300"
        style={{
          transform: isControlsVisible ? "translateY(0)" : "translateY(100px)",
          opacity: isControlsVisible ? 1 : 0,
          pointerEvents: isControlsVisible ? "auto" : "none",
        }}
      >
        <Controls
          onChatToggle={onChatToggle}
          onToggleMicrophone={handleToggleMicrophone}
          onToggleCamera={handleToggleCamera}
          onAddUser={handleCopyMeetLink}
          isMicEnabled={micTrackProps.enabled}
          isCameraEnabled={cameraTrackProps.enabled}
          onSelectAudioInput={handleSelectAudioInput}
          onSelectAudioOutput={handleSelectAudioOutput}
          onSelectVideoInput={handleSelectVideoInput}
          selectedAudioInputId={currentDevices.audioInput}
          selectedAudioOutputId={currentDevices.audioOutput}
          selectedVideoInputId={currentDevices.videoInput}
        />
      </div>
    </div>
  );
};

export default CallGrid;
