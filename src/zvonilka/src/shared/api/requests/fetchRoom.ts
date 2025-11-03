import type { ApiRoom } from "@shared/types/ApiRoom";
import { fetchApi } from "../fetchApi";
import { useQuery } from "@tanstack/react-query";
import { useCreateRoom } from "./createRoom";

export const fetchRoom = ({
  roomId,
  username = "",
}: {
  roomId: string;
  username?: string;
}) => {
  return fetchApi<ApiRoom>(
    `/rooms/${roomId}?username=${encodeURIComponent(username)}`
  );
};

export const useFetchRoom = (roomId: string, userName: string) => {
  const { mutate: createRoom } = useCreateRoom();

  return useQuery({
    queryKey: ["fetchRoom", roomId],
    staleTime: 6 * 60 * 60 * 1000,
    queryFn: () =>
      fetchRoom({
        roomId: roomId as string,
        username: userName,
      }).catch((error) => {
        if (error.statusCode == "404") {
          createRoom({ slug: roomId, username: userName });
        }
      }),
    retry: false,
  });
};
