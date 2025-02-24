//@ts-nocheck
import { useEffect, useState, useContext } from "react";
import DefaultLayout from "@/layouts/default";
import useChats from "@/hooks/useChats";
import { Button, Tabs, Tab } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Textarea } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { GlobalConfigContext } from "@/config/GlobalConfig";

const Chat = () => {
  const { user } = useContext(GlobalConfigContext);
  const [selectedKey, setSelectedKey] = useState<"general" | "job">("general");
  const [selectedChatID, setSelectedChatID] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [editingMessageID, setEditingMessageID] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [updateSettingsMode, setUpdateSettingsMode] = useState(false);
  const [jobUpdate, setJobUpdate] = useState<{
    revealIdentity?: boolean;
    status?: string;
    offerPrice?: number;
  }>({});

  const {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    fetchChats,
    selectChatByID,
    sendChatMessage,
    removeChat,
    editChatMessage,
    updateJobSettings,
  } = useChats();

  const generalChats = chats.filter((chat) => chat.chatType === "general");
  const jobChats = chats.filter((chat) => chat.chatType === "job");

  // Fetch chats 
  useEffect(() => {
    (async () => {
      await fetchChats();
      const currentChats = selectedKey === "general" ? generalChats : jobChats;
      if (!selectedChat && currentChats.length > 0) {
        await selectChatByID(currentChats[0].chatID);
        setSelectedChatID(currentChats[0].chatID);
      }
    })();
   
  }, [selectedKey]);

  const handleSelectChat = async (chatID: string) => {
    setSelectedChatID(chatID);
    await selectChatByID(chatID);
    setUpdateSettingsMode(false);
    setEditingMessageID(null);
  };

  const handleSendMessage = async () => {
    if (selectedChat && newMessage.trim()) {
      await sendChatMessage(
        { chatID: selectedChat.chatID, text: newMessage.trim() }
      );
      setNewMessage("");
    }
  };

  const handleEditMessage = async (messageID: string) => {
    if (selectedChat && editedText.trim()) {
      await editChatMessage(selectedChat.chatID, messageID, editedText.trim());
      setEditingMessageID(null);
      setEditedText("");
    }
  };

  const findOtherUsername = (chat: any) => {
    if (!chat || !chat.participants || !user) return "";
    if (chat.chatType !== "job") {
      const other = chat.participants.find((p: any) => p.userID !== user.userID);
      return other ? other.username : "";
    }
    const { transaction } = chat;
    if (!transaction) return "";
    const applicantID = transaction.applicantID?.toString();
    if (user.userID === applicantID) {
      const hirer = chat.participants.find((p: any) => p.userID !== applicantID);
      return hirer ? hirer.username : "";
    } else {
      return transaction.applicantAnonymous && !transaction.revealIdentity
        ? "Anonymous"
        : chat.participants.find((p: any) => p.userID === applicantID)?.username || "";
    }
  };

  const handleJobSettingsUpdate = async () => {
    if (selectedChat) {
      await updateJobSettings(selectedChat.chatID, jobUpdate);
      setUpdateSettingsMode(false);
    }
  };

  const renderChatLayout = (filteredChats: any[]) => (
    <div className="flex flex-col md:flex-row gap-4 p-4">
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
                  <p>{chat.participants.map((p: any) => p.username).join(", ")}</p>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-full md:w-2/3">
        {selectedChat ? (
          <>
            <Card className="mb-4">
              <CardHeader>
                <h2 className="text-xl font-bold">
                  Chat with: {findOtherUsername(selectedChat)}
                </h2>
                {selectedChat.chatType === "job" && (
                  <p className="text-sm text-gray-500">(Job Chat)</p>
                )}
              </CardHeader>
              <CardBody className="max-h-96 overflow-y-auto">
                {loading ? (
                  <Spinner size="sm" />
                ) : messages.length > 0 ? (
                  messages.map((msg: any) => (
                    <div key={msg.msgID} className="p-2 border-b">
                      <p>
                        <strong>
                          {msg.sender === user.userID &&
                          selectedChat.chatType === "job" &&
                          selectedChat.transaction &&
                          selectedChat.transaction.applicantAnonymous &&
                          !selectedChat.transaction.revealIdentity
                            ? "You (Anonymous)"
                            : msg.sender}
                        </strong>
                        :{" "}
                        {editingMessageID === msg.msgID ? (
                          <>
                            <Textarea
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className="inline-block w-2/3"
                            />
                            <Button onPress={() => handleEditMessage(msg.msgID)}>
                              Save
                            </Button>
                            <Button onPress={() => setEditingMessageID(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          msg.message
                        )}
                      </p>
                      <small>{new Date(msg.timestamp).toLocaleString()}</small>
                      {msg.sender === user.userID && editingMessageID !== msg.msgID && (
                        <Button
                          variant="solid"
                          size="sm"
                          onPress={() => {
                            setEditingMessageID(msg.msgID);
                            setEditedText(msg.message);
                          }}
                        >
                          Edit
                        </Button>
                      )}
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
            {selectedChat.chatType === "job" && (
              <>
                <Button variant="solid" onPress={() => setUpdateSettingsMode(!updateSettingsMode)}>
                  {updateSettingsMode ? "Cancel Update" : "Update Job Settings"}
                </Button>
                {updateSettingsMode && (
                  <div className="p-4 border mt-2">
                    <label className="block mb-2">
                      Reveal Applicant Identity:
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setJobUpdate((prev) => ({ ...prev, revealIdentity: e.target.checked }))
                        }
                        className="ml-2"
                      />
                    </label>
                    <label className="block mb-2">
                      Status:
                      <select
                        onChange={(e) =>
                          setJobUpdate((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="ml-2"
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </label>
                    <label className="block mb-2">
                      Offer Price:
                      <input
                        type="number"
                        onChange={(e) =>
                          setJobUpdate((prev) => ({ ...prev, offerPrice: Number(e.target.value) }))
                        }
                        className="ml-2"
                      />
                    </label>
                    <Button onPress={handleJobSettingsUpdate}>Update Settings</Button>
                  </div>
                )}
              </>
            )}
            <Button variant="ghost" onPress={() => removeChat(selectedChat.chatID)}>
              Delete Chat
            </Button>
          </>
        ) : (
          <p>Select a chat from the list to view messages.</p>
        )}
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
        aria-label="Chats"
      >
        <Tab key="general" title="General Chats">
          {renderChatLayout(generalChats)}
        </Tab>
        <Tab key="job" title="Job Chats">
          {renderChatLayout(jobChats)}
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
};

export default Chat;
