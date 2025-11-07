import { useCreateRoom } from "@shared/api/requests/createRoom";
import { fetchRoom } from "@shared/api/requests/fetchRoom";
import { useConfig } from "@shared/api/requests/useConfig";
import type { ApiRoom } from "@shared/types/ApiRoom";
import { usePersistentUserChoices } from "@shared/hooks/usePersistentUserChoices";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { RoomOptions } from "livekit-client";

type UserProfile = {
  username: string;
  displayName?: string;
  avatar?: string;
  videoDeviceId?: string;
  audioDeviceId?: string;
  audioOutputDeviceId?: string;
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
  roomOptions?: RoomOptions;
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
  const { userChoices } = usePersistentUserChoices();

  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    username: userChoices.username || "guest",
    displayName: userChoices.username || "Guest",
    avatar: undefined,
    videoDeviceId: userChoices.videoDeviceId,
    audioDeviceId: userChoices.audioDeviceId,
    audioEnabled: userChoices.audioEnabled ?? true,
    videoEnabled: userChoices.videoEnabled ?? true,
    audioOutputDeviceId: "default",
  }));

  const [roomData, setRoomData] = useState<ApiRoom | undefined>(undefined);
  const [serverUrl, setServerUrl] = useState<string | undefined>(undefined);
  const [livekitToken, setLivekitToken] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      videoCodec: "vp9",
    },
    audioCaptureDefaults: {
      deviceId: userProfile.audioDeviceId ?? undefined,
    },
    audioOutput: {
      deviceId: userProfile.audioOutputDeviceId ?? undefined,
    },
  };

  const fetchOrCreate = useCallback(async () => {
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
    } catch (e: unknown) {
      const error = e as Record<string, unknown>;
      if (error?.statusCode === "404") {
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
  }, [roomId, userProfile.username, apiConfig?.livekit?.url, createRoom]);

  const initialize = useCallback(async () => {
    await fetchOrCreate();
  }, [fetchOrCreate]);

  const refresh = useCallback(async () => {
    await fetchOrCreate();
  }, [fetchOrCreate]);

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
  }, [roomId, userProfile.username, initialize]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newUsername = localStorage.getItem("username") || "";

      if (newUsername && newUsername !== "guest") {
        setUserProfile((prev) => ({
          ...prev,
          username: newUsername,
          displayName: newUsername,
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const newUsername = localStorage.getItem("username") || "";
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
  }, [userProfile.username]);

  return {
    roomId: roomId ?? "",
    mode,
    serverUrl,
    livekitToken,
    roomData,
    userProfile,
    roomOptions,
    readyToConnect,
    error,
    initialize,
    refresh,
    requestPermissions,
  };
};
