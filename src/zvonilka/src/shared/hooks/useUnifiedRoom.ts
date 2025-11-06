import { useCreateRoom } from "@shared/api/requests/createRoom";
import { fetchRoom } from "@shared/api/requests/fetchRoom";
import { useConfig } from "@shared/api/requests/useConfig";
import type { ApiRoom } from "@shared/types/ApiRoom";
import { userPreferencesStore } from "@shared/stores/userPreferences";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type UserProfile = {
  username: string;
  displayName?: string;
  avatar?: string;
  videoDeviceId?: string;
  audioDeviceId?: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  processorSerialized?: string;
};

type UnifiedRoomState = {
  roomId: string;
  mode: "join" | "create";
  serverUrl?: string;
  livekitToken?: string;
  roomData?: ApiRoom;
  userProfile?: UserProfile;
  readyToConnect: boolean;
  error?: string;
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
};

export const useUnifiedRoom = (
  mode: "join" | "create" = "join"
): UnifiedRoomState => {
  const { id: roomId } = useParams<{ id: string }>();
  const { data: apiConfig } = useConfig();
  const [readyToConnect, setReadyToConnect] = useState(false);
  const { mutateAsync: createRoom } = useCreateRoom();

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedUsername = localStorage.getItem("username") || "";
    return {
      username: savedUsername || "guest",
      displayName: savedUsername || "Guest",
      avatar: undefined,
      videoDeviceId: undefined,
      audioDeviceId: undefined,
      audioEnabled: true,
      videoEnabled: true,
    };
  });

  const [roomData, setRoomData] = useState<ApiRoom | undefined>(undefined);
  const [serverUrl, setServerUrl] = useState<string | undefined>(undefined);
  const [livekitToken, setLivekitToken] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchOrCreate = async () => {
    if (!roomId) {
      return;
    }

    const username = userProfile.username || "guest";

    try {
      const data = await fetchRoom({
        roomId,
        username,
      });

      setRoomData(data);
      setServerUrl(data?.livekit?.url ?? apiConfig?.livekit?.url);
      setLivekitToken(data?.livekit?.token ?? "");
      setReadyToConnect(true);
      return data;
    } catch (e: any) {
      if (e?.statusCode === "404") {
        try {
          const created = await createRoom({
            slug: roomId,
            username,
          });
          setRoomData(created);
          setServerUrl(created?.livekit?.url ?? apiConfig?.livekit?.url);
          setLivekitToken(created?.livekit?.token ?? "");
          setReadyToConnect(true);
          return created;
        } catch (createError) {
          setError("Failed to create room");
          throw createError;
        }
      } else {
        setError("Failed to fetch room");
        throw e;
      }
    }
  };

  const initialize = async () => {
    await fetchOrCreate();
  };

  const refresh = async () => {
    await fetchOrCreate();
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      const perms = { camera: true, mic: true };
      localStorage.setItem("devicesAuthorized", JSON.stringify(perms));
      localStorage.setItem("cameraPermissionGranted", "true");
      localStorage.setItem("micPermissionGranted", "true");
      return true;
    } catch (e) {
      console.log("Permission denied for camera/microphone", e);
      const perms = { camera: false, mic: false };
      localStorage.setItem("devicesAuthorized", JSON.stringify(perms));
      localStorage.setItem("cameraPermissionGranted", "false");
      localStorage.setItem("micPermissionGranted", "false");
      return false;
    }
  };

  useEffect(() => {
    if (!roomId) {
      return;
    }

    if (!userProfile.username || userProfile.username === "guest") {
      return;
    }

    initialize();
  }, [roomId, userProfile.username]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newUsername = userPreferencesStore.getUsername();

      if (newUsername && newUsername !== "guest") {
        setUserProfile((prev) => ({
          ...prev,
          username: newUsername,
          displayName: newUsername,
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const newUsername = userPreferencesStore.getUsername();
    if (newUsername && newUsername !== userProfile.username) {
      setUserProfile((prev) => ({
        ...prev,
        username: newUsername,
        displayName: newUsername,
      }));
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    roomId: roomId ?? "",
    mode,
    serverUrl,
    livekitToken,
    roomData,
    userProfile,
    readyToConnect,
    error,
    initialize,
    refresh,
    requestPermissions,
  };
};
