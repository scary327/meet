import UserCard from "./UserCard";

// Моковые данные пользователей
const users = [
  { id: 1, name: "User1" },
  { id: 2, name: "User2" },
  { id: 3, name: "User3" },
  { id: 4, name: "User4" },
  { id: 5, name: "User5" },
  { id: 6, name: "User6" },
];

export default function CallGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-[var(--default-black)] h-full p-6 rounded-xl items-stretch justify-items-center min-h-[400px]">
      {users.map((user) => (
        <UserCard key={user.id} name={user.name} />
      ))}
    </div>
  );
}
