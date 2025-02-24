// ChatWindow.tsx
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input, Textarea } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { title } from "./primitives";
import { Avatar } from "@heroui/react";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "./icons";

const ChatWindow = ({
  selectedChat,
  messages,
  loading,
  editingMessageID,
  editedText,
  setEditedText,
  handleEditMessage,
  newMessage,
  setNewMessage,
  handleSendMessage,
  user,
  findOtherUser,
  isUserSender,
  setEditingMessageID,
  handleDeleteMessage,
}) => {
  const handleSetMsg = (msg) => {
    setEditedText(msg?.message);
    setEditingMessageID(msg.msgID);
  };
  const isUserAnonymous =
    selectedChat?.transaction?.applicantID === user?.userID &&
    selectedChat?.transaction?.applicantAnonymous;
  return (
    <div className="w-full">
      {selectedChat ? (
        <>
          <Card className="mb-4">
            <CardHeader>
              <h2
                className={title({
                  size: "md",
                  fullWidth: true,
                  color: "violet",
                })}
              >
                Chat with: {findOtherUser(selectedChat)?.username}
              </h2>
              {selectedChat.chatType === "job" && (
                <p className="text-xs text-gray-500">(Job Chat)</p>
              )}
            </CardHeader>
            <CardBody className="max-h-96 overflow-y-auto">
              {loading ? (
                <Spinner size="sm" />
              ) : messages.length > 0 ? (
                messages.map((msg: any) => (
                  <div key={msg.msgID} className="p-2 border-b">
                    <Card>
                      <CardBody>
                        <strong>
                          {isUserSender(msg)
                            ? isUserAnonymous
                              ? user?.profile?.anonymousInfo?.anonymousIdentity
                              : user?.username
                            : findOtherUser(selectedChat)?.username}
                        </strong>
                        :{" "}
                        {editingMessageID === msg.msgID ? (
                          <>
                            <Input
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                            />
                            <Button
                              onPress={() => handleEditMessage(msg.msgID)}
                            >
                              Save
                            </Button>
                            <Button onPress={() => setEditedText("")}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          msg.message
                        )}
                      </CardBody>
                      <CardFooter>
                        {msg.sender === user.userID &&
                          editingMessageID !== msg.msgID && (
                            <>
                              <Button
                                variant="solid"
                                onPress={() => handleSetMsg(msg)}
                                isIconOnly
                                color="primary"
                              >
                                <EditIcon />
                              </Button>
                              <Button
                                variant="solid"
                                onPress={()=>handleDeleteMessage(msg.msgID)}
                                color="danger"
                                isIconOnly
                              >
                                <DeleteIcon />
                              </Button>
                            </>
                          )}
                      </CardFooter>
                    </Card>
                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </CardBody>
            <CardFooter className="flex items-center gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button onPress={handleSendMessage}>Send</Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <p>Select a chat from the list to view messages.</p>
      )}
    </div>
  );
};

export default ChatWindow;
