import { useRemoteParticipants, useRoomContext } from "@livekit/components-react";
import { useEffect, useRef } from "react";
import { RoomEvent } from "livekit-client";

export const useConnectionObserver = () => {
  const room = useRoomContext();
  const connectionStartTimeRef = useRef<number | null>(null);

  const remoteParticipants = useRemoteParticipants({
    updateOnlyOn: [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
    ],
  });

  useEffect(() => {
    if (!room) return;

    const handleConnection = () => {
      if (connectionStartTimeRef.current != null) return;
      connectionStartTimeRef.current = Date.now();
      console.log("Connected to room");
    };

    const handleDisconnect = () => {
      const connectionEndTime = Date.now();
      const duration = connectionStartTimeRef.current
        ? connectionEndTime - connectionStartTimeRef.current
        : -1;
      console.log("Disconnected from room", { sessionDuration: duration });
    };

    const handleParticipantConnected = () => {
      console.log(
        "Participant connected. Total remote participants:",
        remoteParticipants.length
      );
    };

    const handleParticipantDisconnected = () => {
      console.log(
        "Participant disconnected. Total remote participants:",
        remoteParticipants.length
      );
    };

    room.on(RoomEvent.Connected, handleConnection);
    room.on(RoomEvent.Disconnected, handleDisconnect);
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    return () => {
      room.off(RoomEvent.Connected, handleConnection);
      room.off(RoomEvent.Disconnected, handleDisconnect);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    };
  }, [room, remoteParticipants.length]);

  useEffect(() => {
    return () => {
      connectionStartTimeRef.current = null;
    };
  }, []);
};

