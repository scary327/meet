import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchApi } from "../fetchApi";
import type { ApiError } from "../ApiError";

export type WaitingParticipant = {
  id: string;
  status: string;
  username: string;
  color: string;
};

export type WaitingParticipantsResponse = {
  participants: WaitingParticipant[];
};

export type WaitingParticipantsParams = {
  roomId: string;
};

export const listWaitingParticipants = async ({
  roomId,
}: WaitingParticipantsParams): Promise<WaitingParticipantsResponse> => {
  return fetchApi<WaitingParticipantsResponse>(
    `/rooms/${roomId}/waiting-participants/`,
    {
      method: "GET",
    }
  );
};

export const useListWaitingParticipants = (
  roomId: string,
  queryOptions?: Omit<
    UseQueryOptions<
      WaitingParticipantsResponse,
      ApiError,
      WaitingParticipantsResponse
    >,
    "queryKey"
  >
) => {
  return useQuery<
    WaitingParticipantsResponse,
    ApiError,
    WaitingParticipantsResponse
  >({
    queryKey: ["waitingParticipants", roomId],
    queryFn: () => listWaitingParticipants({ roomId }),
    ...queryOptions,
  });
};
