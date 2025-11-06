import {
  useRemoteParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { useEffect, useRef } from "react";
import { DisconnectReason, RoomEvent } from "livekit-client";

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
      // Preserve original connection timestamp across reconnections to measure
      // total session duration from first connect to final disconnect.
      if (connectionStartTimeRef.current != null) return;
      connectionStartTimeRef.current = Date.now();
      console.log("Connected to room");
    };

    const handleReconnect = () => {
      console.log("Reconnecting to room");
    };

    const handleReconnected = () => {
      console.log("Reconnected to room");
    };

    const handleSignalingConnect = () => {
      console.log("Signaling connected");
    };

    const handleSignalingReconnect = () => {
      console.log("Signaling reconnecting");
    };

    const handleDisconnect = (
      disconnectReason: DisconnectReason | undefined
    ) => {
      const connectionEndTime = Date.now();

      console.log("Disconnected from room", {
        // Calculate total session duration from first connection to final disconnect
        // This duration is sensitive to refreshing the page.
        sessionDuration: connectionStartTimeRef.current
          ? connectionEndTime - connectionStartTimeRef.current
          : -1,
        reason: disconnectReason
          ? DisconnectReason[disconnectReason]
          : "UNKNOWN",
      });
    };

    room.on(RoomEvent.Connected, handleConnection);
    room.on(RoomEvent.SignalConnected, handleSignalingConnect);
    room.on(RoomEvent.Disconnected, handleDisconnect);
    room.on(RoomEvent.Reconnecting, handleReconnect);
    room.on(RoomEvent.Reconnected, handleReconnected);
    room.on(RoomEvent.SignalReconnecting, handleSignalingReconnect);

    return () => {
      room.off(RoomEvent.Connected, handleConnection);
      room.off(RoomEvent.SignalConnected, handleSignalingConnect);
      room.off(RoomEvent.Disconnected, handleDisconnect);
      room.off(RoomEvent.Reconnecting, handleReconnect);
      room.off(RoomEvent.Reconnected, handleReconnected);
      room.off(RoomEvent.SignalReconnecting, handleSignalingReconnect);
    };
  }, [room, remoteParticipants.length]);

  useEffect(() => {
    return () => {
      connectionStartTimeRef.current = null;
    };
  }, []);
};
