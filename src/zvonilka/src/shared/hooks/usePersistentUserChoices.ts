import { useSnapshot } from "valtio";
import { userChoicesStore } from "@shared/stores/userChoices";

export function usePersistentUserChoices() {
  const userChoicesSnap = useSnapshot(userChoicesStore);

  return {
    userChoices: userChoicesSnap,
    saveAudioInputEnabled: (isEnabled: boolean) => {
      userChoicesStore.audioEnabled = isEnabled;
    },
    saveVideoInputEnabled: (isEnabled: boolean) => {
      userChoicesStore.videoEnabled = isEnabled;
    },
    saveAudioInputDeviceId: (deviceId: string) => {
      userChoicesStore.audioDeviceId = deviceId;
    },
    saveAudioOutputDeviceId: (deviceId: string) => {
      localStorage.setItem("audioOutputDeviceId", deviceId);
    },
    saveVideoInputDeviceId: (deviceId: string) => {
      userChoicesStore.videoDeviceId = deviceId;
    },
    saveUsername: (username: string) => {
      userChoicesStore.username = username;
      localStorage.setItem("username", username);
    },
  };
}
