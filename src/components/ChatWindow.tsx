// --- ChatWindow.tsx ---
import { Card, CardBody, CardFooter, CardHeader, Spinner, Avatar, Input, Button, Textarea } from "@heroui/react";
import { DeleteIcon, EditIcon, HeartFilledIcon } from "./icons";

export const ChatWindow = ({
  selectedChat,
  messages = [],
  loading,
  editingMessageID,
  editedText,
  setEditedText,
  onEditMessage,
  newMessage,
  setNewMessage,
  onSendMessage,
  getDisplayUser,
  isUserSender,
  setEditingMessageID,
  onDeleteMessage,
  isUserAnonymous,
  user
}) => {

  if (!selectedChat) {
    return (
      <div className="w-full">
        <p className="text-center">Select a chat from the list to view messages.</p>
      </div>
    );
  }

  
  if (loading) {
    return (
      <div className="w-full">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  // Extract the "display" user (the other participant).
  const displayUser = getDisplayUser(selectedChat);

  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={displayUser?.avatar}
                fallback
                name={displayUser?.username}
                size="md"
              />
              <h2 className="text-xl font-bold">
                Chat with: {displayUser?.username}
              </h2>
            </div>
            {selectedChat.chatType === "job" && selectedChat.transaction.applicantAnonymous && (
              <p className="text-md text-gray-500 pl-5">(Anonymous Chat)</p>
            )}
          </div>
        </CardHeader>

        <CardBody className="max-h-96 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-center">No messages yet.</p>
          ) : (
            messages.map((msg) => {
              
              const messageID = msg.msgID;
              const sentByUser = isUserSender(msg);

           
              let senderProfile;
              if (sentByUser && isUserAnonymous(selectedChat)) {
              
                senderProfile = { username: `${user?.profile?.anonymousInfo?.anonymousIdentity}(MaskON)` || "Anonymous" };
              } else if (sentByUser) {
                senderProfile = user || {};
              } else {
                senderProfile = displayUser ;
              }

              const bgColor = sentByUser ? "bg-default-100" : "bg-foreground-500";

              return (
                <div
                  key={messageID}
                  className={`flex ${sentByUser ? "justify-start" : "justify-end"}`}
                >
                  <Card className={`w-10/12 ${bgColor}`}>
                    <CardHeader className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={senderProfile?.avatar}
                          size="sm"
                          fallback
                          name={senderProfile?.username}
                        />
                        <strong>{senderProfile?.username}</strong>
                      </div>
                    </CardHeader>

                    <CardBody className="p-2">
                      {/* If we're editing this particular message, show edit input */}
                      {editingMessageID === messageID ? (
                        <>
                          <Input
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                          />
                          <div className="flex gap-2 mt-1">
                            <Button
                              onPress={() => onEditMessage(messageID)}
                              isIconOnly
                              disabled={editingMessageID !== messageID}
                            >
                              <HeartFilledIcon />
                            </Button>
                            <Button
                              onPress={() => setEditingMessageID(null)}
                              isIconOnly
                              disabled={editingMessageID !== messageID}
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        </>
                      ) : (
                        // For illustration, assume msg.message is the decrypted text you assigned.
                        <pre className="pl-3 text-xl">
                          {msg.message || "[No content]"}
                        </pre>
                      )}
                    </CardBody>

                    <CardFooter className="p-2 flex justify-between items-center">
                      <small>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleString()
                          : ""}
                      </small>
                      {/* Only show edit/delete for the user's own messages & if not currently editing */}
                      {sentByUser && editingMessageID !== messageID && (
                        <div className="flex gap-1">
                          <Button
                            variant="solid"
                            onPress={() => {
                              setEditedText(msg.message || "");
                              setEditingMessageID(messageID);
                            }}
                            isIconOnly
                            color="primary"
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            variant="solid"
                            onPress={() => onDeleteMessage(messageID)}
                            color="danger"
                            isIconOnly
                          >
                            <DeleteIcon />
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              );
            })
          )}
        </CardBody>

        {/* Message input */}
        <CardFooter className="flex items-center gap-2 p-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button onPress={onSendMessage}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
