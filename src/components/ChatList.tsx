
import { Button, Avatar } from "@heroui/react";

export const ChatList = ({
  chats = [],
  selectedChatID,
  loading,
  error,
  onSelectChat,
  getDisplayUser
}) => {
  
  if (loading) {
    return ;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!Array.isArray(chats) || chats.length === 0) {
    return <p>No chats available.</p>;
  }

  return (
    <div className="w-full md:w-1/3 border-r pr-2">
      <ul>
        {chats.map((chat) => {
          const displayUser = getDisplayUser(chat);
          return (
            <li key={chat.chatID}>
              <Button
                className={`p-2 border-b w-full text-left ${
                  selectedChatID === chat.chatID ? "bg-gray-200" : ""
                }`}
                onPress={() => onSelectChat(chat.chatID)}
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    src={displayUser?.avatar || "/fallback-avatar.png"}
                    size="sm"
                    alt={displayUser?.username || "Anonymous"}
                  />
                  <p>{displayUser?.username || "Anonymous"}</p>
                </div>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
