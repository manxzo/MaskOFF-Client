//@ts-nocheck
import { useState, useEffect, useContext } from "react";
import { Tabs, Tab } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import useChats from "@/hooks/useChats";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatJobSettings } from "@/components/ChatJobSettings";
import { ChatList } from "@/components/ChatList";
import { GlobalConfigContext } from "@/config/GlobalConfig";

const Chat = () => {
  const { user,refreshChats } = useContext(GlobalConfigContext);

  const [selectedKey, setSelectedKey] = useState("general");
  const [selectedChatID, setSelectedChatID] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedMsgID, setSelectedMsgID] = useState(null);
  const [editedMsg, setEditedMsg] = useState("");
  const [updateSettingsMode, setUpdateSettingsMode] = useState(false);
  const [jobUpdate, setJobUpdate] = useState({ applicantAnonymous:false, status:"", offerPrice:0});

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
    deleteChatMessage
  } = useChats();

 
  const generalChats = (chats || []).filter((c) => c.chatType === "general");
  const jobChats = (chats || []).filter((c) => c.chatType === "job");


  const getDisplayUser = (chat) => {
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

  
  const isUserSender = (msg) => msg?.sender === user?.userID;

  
  const isUserAnonymous = (chat) => {
    if (!chat || chat.chatType !== "job") return false;
    const applicantID = chat.transaction?.applicantID;
    const applicantAnonymous = chat.transaction?.applicantAnonymous;
    return applicantID === user?.userID && applicantAnonymous;
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    (async () => {
      try {
        await fetchChats();
      } catch (err) {
        console.error("Error fetching chats:", err);
      }

     
      const currentChats = selectedKey === "general" ? generalChats : jobChats;
      if (!selectedChat && currentChats.length > 0) {
        await selectChatByID(currentChats[0].chatID);
        setSelectedChatID(currentChats[0].chatID);
      }
    })();
   
  }, [selectedKey,selectedChat,refreshChats]);

  const handleSelectChat = async (chatID) => {
    setSelectedChatID(chatID);
    setUpdateSettingsMode(false);
    setSelectedMsgID(null);
    try {
      await selectChatByID(chatID);
      const {applicantAnonymous,status,offerPrice} = await selectedChat?.transaction;
      setJobUpdate({applicantAnonymous:applicantAnonymous,status:status,offerPrice:offerPrice})
    } catch (err) {
      console.error("Error selecting chat:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;
    try {
      await sendChatMessage({ chatID: selectedChat.chatID, text: newMessage.trim() });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleEditMessage = async (messageID) => {
    if (!selectedChat || !editedMsg.trim()) return;
    try {
      await editChatMessage(selectedChat.chatID, messageID, editedMsg.trim());
      setSelectedMsgID(null);
      setEditedMsg("");
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const handleDeleteMessage = async (messageID) => {
    if (!selectedChat || !messageID) return;
    try {
      await deleteChatMessage(selectedChat.chatID, messageID);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };
  const handleJobSettingChange = (e)=>{
     
      setJobUpdate((prev)=>({...prev,[e.name]:e.value}));
  }
  const handleJobSettingsUpdate = async (isAnon) => {
    if (!selectedChat) return;
    try {
      await updateJobSettings(selectedChat.chatID, {...jobUpdate,applicantAnonymous:isAnon});
      
      setUpdateSettingsMode(false);
    } catch (err) {
      console.error("Error updating job settings:", err);
    }
  };

  const handleRemoveChat = async (chatID) => {
    try {
      await removeChat(chatID);
      // Optionally, reset selection if the user just deleted the currently selected chat
      if (chatID === selectedChatID) {
        setSelectedChatID("");
      }
    } catch (err) {
      console.error("Error removing chat:", err);
    }
  };

  return (
    <DefaultLayout>
      <Tabs selectedKey={selectedKey} onSelectionChange={setSelectedKey} aria-label="Chats">
        <Tab key="general" title="General Chats">
          <div className="flex flex-col md:flex-row gap-4 p-4">
            <ChatList
              chats={generalChats}
              selectedChatID={selectedChatID}
              loading={loading}
              error={error}
              onSelectChat={handleSelectChat}
              getDisplayUser={getDisplayUser}
            />
            <div className="w-full md:w-2/3">
              <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                loading={loading}
                editingMessageID={selectedMsgID}
                editedText={editedMsg}
                setEditedText={setEditedMsg}
                onEditMessage={handleEditMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
                user={user}
                getDisplayUser={getDisplayUser}
                isUserSender={isUserSender}
                setEditingMessageID={setSelectedMsgID}
                onDeleteMessage={handleDeleteMessage}
                isUserAnonymous={isUserAnonymous}
              />
              <ChatJobSettings
                selectedChat={selectedChat}
                updateSettingsMode={updateSettingsMode}
                setUpdateSettingsMode={setUpdateSettingsMode}
                jobUpdate={jobUpdate}
                onJobSettingsUpdate={handleJobSettingsUpdate}
                handleJobSettingChange={handleJobSettingChange}
                onRemoveChat={handleRemoveChat}
                user={user}
                loading={loading}
              />
            </div>
          </div>
        </Tab>

        <Tab key="job" title="Job Chats">
          <div className="flex flex-col md:flex-row gap-4 p-4">
            <ChatList
              chats={jobChats}
              selectedChatID={selectedChatID}
              loading={loading}
              error={error}
              onSelectChat={handleSelectChat}
              getDisplayUser={getDisplayUser}
            />
            <div className="w-full md:w-2/3">
              <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                loading={loading}
                editingMessageID={selectedMsgID}
                editedText={editedMsg}
                setEditedText={setEditedMsg}
                onEditMessage={handleEditMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
                user={user}
                getDisplayUser={getDisplayUser}
                isUserSender={isUserSender}
                setEditingMessageID={setSelectedMsgID}
                onDeleteMessage={handleDeleteMessage}
                isUserAnonymous={isUserAnonymous}
              />
              <ChatJobSettings
                selectedChat={selectedChat}
                updateSettingsMode={updateSettingsMode}
                setUpdateSettingsMode={setUpdateSettingsMode}
                jobUpdate={jobUpdate}
                onJobSettingsUpdate={handleJobSettingsUpdate}
                handleJobSettingChange={handleJobSettingChange}
                onRemoveChat={handleRemoveChat}
                user={user}
                loading={loading}
              />
            </div>
          </div>
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
};

export default Chat;
