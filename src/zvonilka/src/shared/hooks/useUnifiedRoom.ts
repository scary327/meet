// src/hooks/useUnifiedRoom.ts
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

  // Получаем имя пользователя из хранилища
  const savedUsername = userPreferencesStore.getUsername();

  const [userProfile] = useState<UserProfile>({
    username: savedUsername || "guest",
    displayName: savedUsername || "Guest",
    avatar: undefined,
    videoDeviceId: undefined,
    audioDeviceId: undefined,
    audioEnabled: true,
    videoEnabled: true,
  });

  const [roomData, setRoomData] = useState<ApiRoom | undefined>(undefined);
  const [serverUrl, setServerUrl] = useState<string | undefined>(undefined);
  const [livekitToken, setLivekitToken] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchOrCreate = async () => {
    if (!roomId) {
      console.log("No roomId, skipping fetch");
      return;
    }

    const username = userProfile.username || "guest";
    console.log("Fetching or creating room:", { roomId, username });

    try {
      const data = await fetchRoom({
        roomId,
        username,
      });

      console.log("Room fetched successfully:", data);
      setRoomData(data);
      setServerUrl(data?.livekit?.url ?? apiConfig?.livekit?.url);
      setLivekitToken(data?.livekit?.token ?? "");
      setReadyToConnect(true);
      return data;
    } catch (e: any) {
      console.log("Fetch failed, trying to create:", e?.statusCode);

      if (e?.statusCode === "404") {
        try {
          const created = await createRoom({
            slug: roomId,
            username,
          });

          console.log("Room created successfully:", created);
          setRoomData(created);
          setServerUrl(created?.livekit?.url ?? apiConfig?.livekit?.url);
          setLivekitToken(created?.livekit?.token ?? "");
          setReadyToConnect(true);
          return created;
        } catch (createError) {
          console.error("Failed to create room:", createError);
          setError("Failed to create room");
          throw createError;
        }
      } else {
        console.error("Failed to fetch room:", e);
        setError("Failed to fetch room");
        throw e;
      }
    }
  };

  const initialize = async () => {
    console.log("Initialize called");
    await fetchOrCreate();
  };

  const refresh = async () => {
    console.log("Refresh called");
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
      console.log("Permissions granted");
      return true;
    } catch (e) {
      const perms = { camera: false, mic: false };
      localStorage.setItem("devicesAuthorized", JSON.stringify(perms));
      localStorage.setItem("cameraPermissionGranted", "false");
      localStorage.setItem("micPermissionGranted", "false");
      console.error("Permissions denied:", e);
      return false;
    }
  };

  // Инициализация при монтировании и при изменении roomId или username
  useEffect(() => {
    if (!roomId) {
      console.log("Skipping init: no roomId");
      return;
    }

    if (!userProfile.username || userProfile.username === "guest") {
      console.log("Skipping init: no username set");
      return;
    }

    console.log("Triggering initialize effect");
    initialize();
  }, [roomId, userProfile.username]);

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
