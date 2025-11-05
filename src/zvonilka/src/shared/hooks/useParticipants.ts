import { useRemoteParticipants } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import type { Participant } from "livekit-client";

export interface ParticipantData {
  id: string;
  name: string;
}

export const useParticipants = (): ParticipantData[] => {
  const remoteParticipants = useRemoteParticipants({
    updateOnlyOn: [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
    ],
  });

  // Преобразуем удалённых участников в формат ParticipantData
  return remoteParticipants.map((participant: Participant) => ({
    id: participant.identity,
    name: participant.name || `User ${participant.identity.slice(0, 5)}`,
  }));
};
