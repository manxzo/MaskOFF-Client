// src/pages/Messages.tsx
import React, { useState, useContext, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext } from "@/config/UserConfig";
import { useMessages } from "@/hooks/useMessages";
import { retrieveAllUsers } from "@/services/services";

export const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { sendMsg, loading } = useMessages();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const { user: currentUser } = useContext(UserConfigContext) || {};
  const [error, setError] = useState<string>("");
  const [currentChat, setCurrentChat] = useState({
    chatID: "",
    participants: [],
    messages: [],
    createdAt: null,
    updatedAt: null,
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await retrieveAllUsers();
        // Filter out the current user
        const filteredUsers = res.filter(
          (user: any) => user.userID !== currentUser?.userID
        );
        setAllUsers(filteredUsers);
      } catch (err: any) {
        setError(err.message || "Error retrieving users");
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Find the chat between the current user and the selected user.
  useEffect(() => {
    const chatLog = currentUser.chats.filter((chat) =>
      chat?.participants?.some((userID) => userID === selectedUserId)
    )[0];
    if(chatLog?.participants?.length>1 && selectedUserId){
    setCurrentChat(chatLog);
    }
  }, [selectedUserId]);

  // Handle sending the message.
  const handleSendMessage = async () => {
    if (selectedUserId && message.trim()) {
      try {
        await sendMsg(selectedUserId, message);
        setMessage("");
        setError("");
      } catch (err: any) {
        // Ensure error is a string so React can render it.
        setError(err.message || "Error sending message");
      }
    } else {
      setError("Type a message!");
    }
  };

  // Allow sending on Enter key press (without Shift).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-200px)] gap-4">
        {/* Left Pane: User List */}
        <Card className="w-1/4">
          <CardHeader>Users</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-2">
              {allUsers.map((user) => (
                <Button
                  key={user.userID}
                  color={selectedUserId === user.userID ? "primary" : "default"}
                  variant={selectedUserId === user.userID ? "solid" : "light"}
                  onPress={() => setSelectedUserId(user.userID)}
                >
                  {user.username}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Right Pane: Chat Window */}
        <Card className="flex-1 h-full">
          <CardHeader>
            {selectedUserId
              ? allUsers.find((user) => user.userID === selectedUserId)
                  ?.username
              : "Select a user"}
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col h-full">
            {/* Chat messages display */}
            <div className="flex-1 flex flex-col gap-2 overflow-auto">
              {currentChat && currentChat.messages.length > 0 ? (
                [...currentChat.messages]
                  .sort(
                    (a, b) =>
                      new Date(a.timestamp).getTime() -
                      new Date(b.timestamp).getTime()
                  )
                  .map((msg: any) => (
                    <div key={msg.messageID} className="p-1 border rounded">
                      <div className="flex justify-between items-center">
                        <strong>
                          {msg.sender === currentUser?.userID ? "You" : allUsers.find((user) => user.userID === selectedUserId).username}
                        </strong>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleDateString()}{" "}
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div>{msg.message}</div>
                    </div>
                  ))
              ) : (
                <p>No messages</p>
              )}
            </div>

            {/* Message input area */}
            <div className="mt-4 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={!selectedUserId}
              />
              <Button
                isLoading={loading}
                onPress={handleSendMessage}
                disabled={!selectedUserId || !message.trim()}
              >
                Send
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </DefaultLayout>
  );
};
