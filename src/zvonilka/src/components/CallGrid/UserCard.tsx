import { useMemo } from "react";

import img1 from "@shared/icons/users/img1.svg";
import img2 from "@shared/icons/users/img2.svg";
import img3 from "@shared/icons/users/img3.svg";
import img4 from "@shared/icons/users/img4.svg";
import img5 from "@shared/icons/users/img5.svg";
import img6 from "@shared/icons/users/img6.svg";

interface UserCardProps {
  name: string;
}

function UserCard({ name }: UserCardProps) {
  const imgSrc = useMemo(() => {
    const images = [img1, img2, img3, img4, img5, img6];
    const rand = Math.floor(Math.random() * images.length);
    return images[rand];
  }, []);

  return (
    <div className="flex flex-col items-center justify-between bg-black border border-white rounded-xl p-3 w-full h-full">
      <div className="flex items-center justify-center flex-1 w-full h-full">
        <img src={imgSrc} alt={name} draggable={false} />
      </div>
      <div className="mt-4 text-white text-lg font-semibold">{name}</div>
    </div>
  );
}

export default UserCard;
