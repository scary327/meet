import { useMemo } from "react";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import { Track } from "livekit-client";
import { VideoTrack, AudioTrack } from "@livekit/components-react";
import {
  isTrackReference,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-core";

import img1 from "@shared/icons/users/img1.svg";
import img2 from "@shared/icons/users/img2.svg";
import img3 from "@shared/icons/users/img3.svg";
import img4 from "@shared/icons/users/img4.svg";
import img5 from "@shared/icons/users/img5.svg";
import img6 from "@shared/icons/users/img6.svg";

interface UserCardProps {
  participant: RemoteParticipant | LocalParticipant;
}

function UserCard({ participant }: UserCardProps) {
  const imgSrc = useMemo(() => {
    const images = [img1, img2, img3, img4, img5, img6];
    const rand = Math.floor(Math.random() * images.length);
    return images[rand];
  }, []);

  const isCameraActive = participant.isCameraEnabled;
  const name = participant.name || participant.identity || "Guest";

  const videoPublication = [...participant.videoTrackPublications.values()][0];
  const audioPublication = [...participant.audioTrackPublications.values()][0];

  const videoTrackRef: TrackReferenceOrPlaceholder | undefined =
    videoPublication
      ? {
          participant,
          source: Track.Source.Camera,
          publication: videoPublication,
        }
      : undefined;

  const audioTrackRef: TrackReferenceOrPlaceholder | undefined =
    audioPublication
      ? {
          participant,
          source: Track.Source.Microphone,
          publication: audioPublication,
        }
      : undefined;

  return (
    <div className="flex flex-col items-center justify-between bg-black border border-white rounded-xl p-3 w-full h-full relative overflow-hidden">
      {isTrackReference(audioTrackRef) && (
        <AudioTrack trackRef={audioTrackRef} />
      )}

      <div className="flex items-center justify-center flex-1 w-full h-full">
        {isCameraActive && isTrackReference(videoTrackRef) ? (
          <VideoTrack
            trackRef={videoTrackRef}
            className="w-full h-full object-cover"
            style={{
              transform: participant.isLocal ? "scaleX(-1)" : undefined,
            }}
          />
        ) : (
          <img
            src={imgSrc}
            alt={name}
            draggable={false}
            className="w-24 h-24"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent text-white text-lg font-semibold p-3 text-center">
        {name}
      </div>
    </div>
  );
}

export default UserCard;
