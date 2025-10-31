import Button from "@shared/ui/Button/Button";
import Microphone from "@shared/icons/mic.svg";
import Camera from "@shared/icons/camera.svg";
import AddUser from "@shared/icons/addUser.svg";
import ChangeBack from "@shared/icons/changeBack.svg";
import { memo } from "react";

export const Controls = memo(() => {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 transform flex rounded-[28px] items-center bg-[var(--default-black)]">
      <Button variant="secondary" shape="circle">
        <img src={Microphone} alt="Microphone" draggable={false} />
      </Button>
      <Button variant="secondary" shape="circle">
        <img src={Camera} alt="Camera" draggable={false} />
      </Button>
      <Button variant="secondary" shape="circle">
        <img src={AddUser} alt="Add User" draggable={false} />
      </Button>
      <Button variant="secondary" shape="circle">
        <img src={ChangeBack} alt="Change Background" draggable={false} />
      </Button>
    </div>
  );
});
Controls.displayName = "Controls";
