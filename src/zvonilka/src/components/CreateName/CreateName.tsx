import Avatar from "@shared/icons/avatar.svg";
import Input from "@shared/ui/Input/Input";
import React from "react";

type CreateNameProps = {
  value?: string;
  onChange?: (value: string) => void;
  error?: string | null;
};

export const CreateName: React.FC<CreateNameProps> = ({ value = "", onChange, error }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-[12px]">
        <div className="py-[15px] px-[19px] border-[1px] border-default-black rounded-full">
          <img src={Avatar} alt="Avatar" />
        </div>
        <Input
          placeholder="Имя"
          variant="default"
          className="min-w-[45vw]"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
        />
      </div>
      {error ? <div className="text-red-500 text-sm mt-2">{error}</div> : null}
    </div>
  );
};
