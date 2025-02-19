// src/pages/Messages.tsx
import React, { useState, useContext, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext, Chat, Friend } from "@/config/UserConfig";
import { useMessages } from "@/hooks/useMessages";
import { useChat } from "@/hooks/useChats";
import { useLocation } from "react-router-dom";

interface Contact {
  id: string;
  username: string;
  chat?: Chat;
}

export const Messages = () => {
  const { user } = useContext(UserConfigContext)!;
  const currentUserID = user.userID;
  const { sendMsg, loading } = useMessages();
  const { chats: localChats } = useChat();
  // Use localChats if available, otherwise fall back to global user.chats.
  const chats: Chat[] =
    localChats.length > 0 ? localChats : user.chats;
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const location = useLocation();

  // On mount, check if a preselectedUser was passed in navigation state.
  useEffect(() => {
    if (location.state && location.state.preselectedUser) {
      setSelectedContact(location.state.preselectedUser);
    }
  }, [location]);

  // Build unified contacts list based on chats and friends.
  useEffect(() => {
    const contactsMap = new Map<string, Contact>();
    // Process chats: always pick the other participant.
    chats?.forEach((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p.userID !== currentUserID
      );
      if (otherParticipant) {
        contactsMap.set(otherParticipant.userID, {
          id: otherParticipant.userID,
          username: otherParticipant.username,
          chat,
        });
      }
    });
    // Add friends that don't have an associated chat.
    user?.friends?.forEach((friend: Friend) => {
      if (!contactsMap.has(friend.userID)) {
        contactsMap.set(friend.userID, {
          id: friend.userID,
          username: friend.username,
        });
      }
    });
    setContacts(Array.from(contactsMap.values()));
  }, [chats, user.friends, currentUserID]);

  // Derive the current chat based on the selected contact.
  const currentChat: Chat | null = selectedContact
    ? chats.find((chat) =>
        chat.participants.some((p) => p.userID === selectedContact.id)
      ) || null
    : null;

  const handleSendMessage = async () => {
    if (!selectedContact) {
      setError("Select a contact to chat with.");
      return;
    }
    if (!message.trim()) {
      setError("Type a message!");
      return;
    }
    try {
      await sendMsg(selectedContact.id, message);
      setMessage("");
      setError("");
    } catch (err: any) {
      setError(err.message || "Error sending message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-200px)] gap-4">
        {/* Left Pane: Contacts List */}
        <Card className="w-1/4">
          <CardHeader>Contacts</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-2">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <Button
                    key={contact.id}
                    color={
                      selectedContact?.id === contact.id ? "primary" : "default"
                    }
                    variant={
                      selectedContact?.id === contact.id ? "solid" : "light"
                    }
                    onPress={() => setSelectedContact(contact)}
                  >
                    {contact.username}
                  </Button>
                ))
              ) : (
                <p>No contacts available.</p>
              )}
            </div>
          </CardBody>
        </Card>
        {/* Right Pane: Chat Window */}
        <Card className="flex-1 h-full">
          <CardHeader>
            {selectedContact ? selectedContact.username : "Select a contact"}
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col h-full">
            <div className="flex-1 flex flex-col gap-2 overflow-auto">
              {selectedContact ? (
                currentChat && currentChat.messages.length > 0 ? (
                  [...currentChat.messages]
                    .sort(
                      (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                    )
                    .map((msg) => (
                      <div key={msg.messageID} className="p-1 border rounded">
                        <div className="flex justify-between items-center">
                          <strong>
                            {msg.sender === currentUserID
                              ? "You"
                              : selectedContact.username}
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
                  <p className="text-gray-500">
                    No conversation yet. Type a message to start chatting.
                  </p>
                )
              ) : (
                <p>Select a contact to view messages.</p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={!selectedContact}
              />
              <Button
                isLoading={loading}
                onPress={handleSendMessage}
                disabled={!selectedContact || !message.trim()}
              >
                Send
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </DefaultLayout>
  );
};

export default Messages;
