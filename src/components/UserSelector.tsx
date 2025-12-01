interface UserSelectorProps {
  selectedUserId: number;
  onSelectUser: (userId: number) => void;
}

function UserSelector({ selectedUserId, onSelectUser }: UserSelectorProps) {
  return (
    <div className="mb-6 flex gap-3">
      {[1, 2, 3].map((userId) => (
        <button
          key={userId}
          onClick={() => onSelectUser(userId)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedUserId === userId
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          User {userId}
        </button>
      ))}
    </div>
  );
}

export default UserSelector;
