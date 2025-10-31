import BlackStar from "@shared/icons/blackStar.svg";
import Typography from "@shared/ui/Typography/Typography";
import { memo } from "react";

export const Logo = memo(() => {
  return (
    <div className="fixed top-3 left-3 z-50 flex gap-x-[8px] items-center">
      <img src={BlackStar} alt="Black Star" />
      <Typography.Body>Сервер видео конференцсвязи</Typography.Body>
    </div>
  );
});
Logo.displayName = "Logo";
