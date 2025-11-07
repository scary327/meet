import React, { useCallback } from "react";
import UserCard from "./UserCard";
import { Controls } from "@components/Controls/Controls";
import { useToast } from "@shared/hooks/useToast";
import { usePersistentUserChoices } from "@shared/hooks/usePersistentUserChoices";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import {
  useLocalParticipant,
  useTrackToggle,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";

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
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const { showToast } = useToast();
  const {
    userChoices,
    saveAudioInputDeviceId,
    saveAudioInputEnabled,
    saveVideoInputDeviceId,
    saveVideoInputEnabled,
    saveAudioOutputDeviceId,
  } = usePersistentUserChoices();

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
      console.log("Meet link copied to clipboard:", meetLink);
    } catch (error) {
      showToast("Ошибка при копировании ссылки");
      console.error("Failed to copy meet link:", error);
    }
  };

  const handleSelectAudioInput = async (deviceId: string) => {
    if (!localParticipant) return;
    try {
      const currentlyEnabled = micTrackProps.enabled;
      if (currentlyEnabled) {
        await localParticipant.setMicrophoneEnabled(false);
      }
      await localParticipant.setMicrophoneEnabled(true, { deviceId });
      saveAudioInputDeviceId(deviceId);
      showToast("Микрофон изменён");
    } catch (error) {
      console.error("Failed to change audio input:", error);
      showToast("Ошибка при смене микрофона");
    }
  };

  const handleSelectAudioOutput = async (deviceId: string) => {
    try {
      await room.switchActiveDevice("audiooutput", deviceId);
      saveAudioOutputDeviceId(deviceId);
      showToast("Динамик изменён");
    } catch (error) {
      console.error("Failed to change audio output:", error);
      showToast("Ошибка при смене динамика");
    }
  };

  const handleSelectVideoInput = async (deviceId: string) => {
    if (!localParticipant) return;
    try {
      const currentlyEnabled = cameraTrackProps.enabled;
      if (currentlyEnabled) {
        await localParticipant.setCameraEnabled(false);
      }
      await localParticipant.setCameraEnabled(true, { deviceId });
      saveVideoInputDeviceId(deviceId);
      showToast("Камера изменена");
    } catch (error) {
      console.error("Failed to change video input:", error);
      showToast("Ошибка при смене камеры");
    }
  };

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
          selectedAudioInputId={userChoices.audioDeviceId}
          selectedAudioOutputId={
            localStorage.getItem("audioOutputDeviceId") || undefined
          }
          selectedVideoInputId={userChoices.videoDeviceId}
        />
      </div>
    </div>
  );
};

export default CallGrid;
