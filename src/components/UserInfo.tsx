import type { User } from "../api/userApi";

interface UserInfoProps {
  user: User;
}

function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="space-y-2">
      <p className="text-gray-300">
        <span className="font-semibold">Name:</span> {user.name}
      </p>
      <p className="text-gray-300">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="text-gray-300">
        <span className="font-semibold">ID:</span> {user.id}
      </p>
    </div>
  );
}

export default UserInfo;
