import { useMemo, useState } from "react";
import purpleCurve from "@shared/icons/purpleCurve.svg";
import { z } from "zod";
import { Logo } from "@components/Logo/Logo";
import { CreateName } from "@components/CreateName/CreateName";
import Button from "@shared/ui/Button/Button";
import { useCreateRoom } from "@shared/api/requests/createRoom";
import { generateRoomId } from "@shared/utils/generateRoomId";
import { useNavigate } from "react-router-dom";
import { authUrl } from "@shared/api/authUrl";
import { userPreferencesStore } from "@shared/stores/userPreferences";

const nameSchema = z
  .string()
  .refine((s) => (s ?? "").toString().trim().length > 0, {
    message: "Введите имя",
  });

const Home = () => {
  const [name, setName] = useState("");

  const parsed = nameSchema.safeParse(name);
  const isValid = useMemo(() => parsed.success, [parsed]);
  const errorMessage =
    !isValid && name !== "" ? parsed.error?.issues?.[0]?.message ?? null : null;

  const createRoom = useCreateRoom();
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (isValid) {
      // Сохраняем имя пользователя перед созданием комнаты
      userPreferencesStore.setUsername(name);

      const slug = generateRoomId();
      createRoom.mutateAsync(
        { slug, username: name },
        {
          onSuccess: (data) => {
            navigate(`/room/${data.slug}`);
          },
          onError: () => {
            window.location.assign(authUrl());
          },
        }
      );
    }
  };

  return (
    <>
      <Logo />
      <div className="centered-container h-screen items-center gap-y-20">
        <CreateName value={name} onChange={setName} error={errorMessage} />
        <div className="group relative w-[286px] h-[235px] mt-[60px] transform transition-transform duration-300 ease-in-out group-hover:rotate-75">
          <img
            src={purpleCurve}
            alt="decorative curve"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-400 ease-in-out"
          />

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Button
              variant="primary"
              size="lg"
              className="font-extrabold text-[24px]"
              disabled={!isValid}
              aria-disabled={!isValid}
              onClick={onSubmit}
            >
              Создать конференцию
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
