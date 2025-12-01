import type { User } from "../api/userApi";
import CacheStatus from "./CacheStatus";
import ChildComponentToggle from "./ChildComponentToggle";
import UserInfo from "./UserInfo";

interface UserCardProps {
  user: User;
  isFetching: boolean;
}

function UserCard({ user, isFetching }: UserCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-purple-400 mb-4">
        📋 Parent Component Data
      </h3>

      <UserInfo user={user} />
      <CacheStatus isFetching={isFetching} />
      <ChildComponentToggle userId={user.id} />
    </div>
  );
}

export default UserCard;
