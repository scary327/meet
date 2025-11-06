import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { Controls } from "@components/Controls/Controls";
import { Toast } from "@components/Toast/Toast";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import { useLocalParticipant } from "@livekit/components-react";

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
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!localParticipant) return;

    setIsMicEnabled(localParticipant.isMicrophoneEnabled);
    setIsCameraEnabled(localParticipant.isCameraEnabled);
  }, [localParticipant]);

  const handleToggleMicrophone = async () => {
    if (!localParticipant) {
      console.warn("Local participant not found");
      return;
    }
    try {
      const newState = !isMicEnabled;
      await localParticipant.setMicrophoneEnabled(newState);
      setIsMicEnabled(newState);
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
    }
  };

  const handleToggleCamera = async () => {
    if (!localParticipant) {
      console.warn("Local participant not found");
      return;
    }
    try {
      const newState = !isCameraEnabled;
      await localParticipant.setCameraEnabled(newState);
      setIsCameraEnabled(newState);
    } catch (error) {
      console.error("Failed to toggle camera:", error);
    }
  };

  const handleCopyMeetLink = async () => {
    const meetLink = window.location.href;
    try {
      await navigator.clipboard.writeText(meetLink);
      setToastMessage("Ссылка на комнату скопирована");
      console.log("Meet link copied to clipboard:", meetLink);
    } catch (error) {
      setToastMessage("Ошибка при копировании ссылки");
      console.error("Failed to copy meet link:", error);
    }
  };

  return (
    <div className="flex-1 relative bg-[var(--default-black)] rounded-xl overflow-hidden flex flex-col">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
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
          isMicEnabled={isMicEnabled}
          isCameraEnabled={isCameraEnabled}
        />
      </div>
    </div>
  );
};

export default CallGrid;
