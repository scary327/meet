import React from "react";
import UserCard from "./UserCard";

interface Participant {
  id: string;
  name: string;
}

interface CallGridProps {
  participants: Participant[];
}

export const CallGrid: React.FC<CallGridProps> = ({ participants }) => {
  const list =
    participants && participants.length
      ? participants
      : [{ id: "u1", name: "Guest" }];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-[var(--default-black)] h-full p-6 rounded-xl items-stretch justify-items-center min-h-[400px]">
      {list.map((p) => (
        <UserCard key={p.id} name={p.name} />
      ))}
    </div>
  );
};

export default CallGrid;
