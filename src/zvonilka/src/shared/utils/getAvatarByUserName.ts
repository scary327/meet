import img1 from "@shared/icons/users/img1.svg";
import img2 from "@shared/icons/users/img2.svg";
import img3 from "@shared/icons/users/img3.svg";
import img4 from "@shared/icons/users/img4.svg";
import img5 from "@shared/icons/users/img5.svg";
import img6 from "@shared/icons/users/img6.svg";

const avatarImages = [img1, img2, img3, img4, img5, img6];

export const getAvatarByUserName = (username: string): string => {
  // Простая хеш-функция из строки в число
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarImages.length;
  return avatarImages[index];
};
