// ChatList.tsx
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";



const ChatList = ({
  filteredChats,
  selectedChatID,
  loading,
  error,
  handleSelectChat,
  findOtherUser
}) => (
  <div className="w-full md:w-1/3 border-r pr-2">
    {loading ? (
      <Spinner size="sm" />
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : filteredChats.length === 0 ? (
      <p>No chats available.</p>
    ) : (
      <ul>
        {filteredChats.map((chat: any) => (
          <li key={chat.chatID}>
            <Button
              className={`p-2 border-b w-full text-left ${
                selectedChatID === chat.chatID ? "bg-gray-200" : ""
              }`}
              onPress={() => handleSelectChat(chat.chatID)}
            >
              <p>{findOtherUser(chat)?.username}</p>
            </Button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ChatList;
