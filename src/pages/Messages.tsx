import { useState, useContext } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext } from "@/config/UserConfig";
import { useMessages } from "@/hooks/useMessages";
import { useEffect } from "react";
import { retrieveAllUsers } from "@/services/services";
export const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState("");
  const {sendMsg,loading} = useMessages();
  const [allUsers,setAllUsers] = useState([]);
  const { user:currentUser } = useContext(UserConfigContext);
  const [error,setError] = useState("");
    useEffect(() => {
      const fetchUsers = async () => {
       
        try {
          const res = await retrieveAllUsers();
          const allUsers = res.filter((user)=>user.userID!==currentUser?.userID)
          setAllUsers(allUsers);
        } catch (err: any) {
        } finally {
  
        }
      };
      fetchUsers();
    }, []);

  


  // Find the chat between the current user and the selected user.
  const currentChat = currentUser.chats?.find((chat) =>
    chat.participants.includes(selectedUserId)
  );

  // Handle sending the message.
  const handleSendMessage = async () => {
    if(selectedUserId && message){
    try{
    await sendMsg(selectedUserId,message);
    setMessage("");
    }
    catch(err){
      setError(err)
    }
  }
  else{
    setError("Type a message!")
  }
    
  };

  // Allow sending on Enter key press (without Shift).
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
              {allUsers?.map((user) => (
                <Button
                  key={user.id}
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
              ? allUsers?.find((user) => user.userID === selectedUserId)
                  ?.username
              : "Select a user"}
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col h-full">
            {/* Chat messages display */}
            <div className="flex-1 flex flex-col gap-2 overflow-auto">
              {currentChat && currentChat.messages.length > 0 ? (
                currentChat.messages.map((msg) => (
                  <div key={msg.messageID} className="p-1 border rounded">
                    <strong>{msg.sender === currentUser.userID ? "You" : "Them"}</strong>
                    : {msg.message}
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
