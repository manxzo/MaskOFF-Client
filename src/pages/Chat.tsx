
import { useEffect, useState, useContext } from "react";
import DefaultLayout from "@/layouts/default";
import useChats from "@/hooks/useChats";
import { Tabs, Tab } from "@heroui/react";
import { GlobalConfigContext } from "@/config/GlobalConfig";

// Import the subcomponents
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import ChatJobSettings from "@/components/ChatJobSettings";
import { deleteMessage } from "@/services/services";


const Chat = () => {
  const { user } = useContext(GlobalConfigContext);
  const [selectedKey, setSelectedKey] = useState<"general" | "job">("general");
  const [selectedChatID, setSelectedChatID] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [editingMessageID, setEditingMessageID] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string | null>(null);
  const [updateSettingsMode, setUpdateSettingsMode] = useState(false);
  const [jobUpdate, setJobUpdate] = useState<{
    applicantAnonymous?: boolean;
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

  // Split chats by type
  const generalChats = chats.filter((chat) => chat.chatType === "general");
  const jobChats = chats.filter((chat) => chat.chatType === "job");
  console.log(chats);

  const findOtherUser = (chat) => {
    const participants = chat.participants;
    if (chat.chatType === "general") {
      const otherUser = participants.filter((p) => p.userID !== user?.userID)[0]
      return otherUser;
    }
    else if (chat.chatType === "job" && chat.transaction.applicantID !== user?.userID) {
      const otherUser = participants.filter((p) => p?.userID !== user?.userID)[0];
      const otherUserMap = { username: otherUser?.anonymousInfo?.anonymousIdentity, details: otherUser?.anonymousInfo?.details }
      return otherUserMap;
    }
    else {
      const otherUser = participants.filter((p) => p.id)[0];
      return otherUser;
    }
  }
  const isUserSender = (message) => {
    const isSender = message.sender === user.userID;
    return isSender;
  }
  // Fetch chats whenever the selected key (chat type) changes
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
      await sendChatMessage({
        chatID: selectedChat.chatID,
        text: newMessage.trim(),
      });
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
  const handleDeleteMessage = async (messageID: string) => {
    if (selectedChat && messageID) {
      await deleteMessage(selectedChat.chatID, messageID);
    }
  }

  const handleJobSettingsUpdate = async () => {
    if (selectedChat) {
      await updateJobSettings(selectedChat.chatID, jobUpdate);
      setUpdateSettingsMode(false);
    }
  };

  // Main layout using the three subcomponents
  const renderChatLayout = (filteredChats: any[]) => (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <ChatList
        filteredChats={filteredChats}
        selectedChatID={selectedChatID}
        loading={loading}
        error={error}
        handleSelectChat={handleSelectChat}
        findOtherUser={findOtherUser}
      />
      <div className="w-full md:w-2/3">
        <ChatWindow
          selectedChat={selectedChat}
          messages={messages}
          loading={loading}
          editingMessageID={editingMessageID}
          setEditingMessageID={setEditingMessageID}
          editedText={editedText}
          setEditedText={setEditedText}
          handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          user={user}
          findOtherUser={findOtherUser}
          isUserSender={isUserSender}
        />
        <ChatJobSettings
          selectedChat={selectedChat}
          updateSettingsMode={updateSettingsMode}
          setUpdateSettingsMode={setUpdateSettingsMode}
          jobUpdate={jobUpdate}
          setJobUpdate={setJobUpdate}
          handleJobSettingsUpdate={handleJobSettingsUpdate}
          removeChat={removeChat}
        />
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
