import React from "react";
import UserCard from "./UserCard";
import { Controls } from "@components/Controls/Controls";

interface Participant {
  id: string;
  name: string;
}

interface CallGridProps {
  participants: Participant[];
  onChatToggle?: () => void;
}

export const CallGrid: React.FC<CallGridProps> = ({ participants, onChatToggle }) => {
  const list =
    participants && participants.length
      ? participants
      : [{ id: "u1", name: "Guest" }];

  return (
    <div className="flex-1 relative bg-[var(--default-black)] rounded-xl overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-6 items-stretch justify-items-center flex-1 overflow-auto">
        {list.map((p) => (
          <UserCard key={p.id} name={p.name} />
        ))}
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <Controls onChatToggle={onChatToggle} />
      </div>
    </div>
  );
};

export default CallGrid;
