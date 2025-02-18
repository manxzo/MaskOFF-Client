// src/pages/Messages.tsx
import React, { useState, useContext, useMemo } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext, Chat, Friend } from "@/config/UserConfig";
import { useMessages } from "@/hooks/useMessages";

interface Contact {
  id: string;
  username: string;
  chat?: Chat;
}

export const Messages = () => {
  const { user } = useContext(UserConfigContext)!;
  const currentUserID = user.userID;
  const { sendMsg, loading } = useMessages();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Build a unified contact list from chats and friends.
  const contacts: Contact[] = useMemo(() => {
    const contactsMap = new Map<string, Contact>();

    // Process chats (each chat always has 2 participants).
    user.chats.forEach((chat) => {
      // Always pick the other participant.
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

    // Add friends that don't already have an associated chat.
    user.friends.forEach((friend: Friend) => {
      if (!contactsMap.has(friend.userID)) {
        contactsMap.set(friend.userID, {
          id: friend.userID,
          username: friend.username,
        });
      }
    });

    return Array.from(contactsMap.values());
  }, [user, currentUserID]);

  // Derive the current chat directly from the user state so it updates whenever user.chats changes.
  const currentChat = useMemo(() => {
    if (!selectedContact) return null;
    return (
      user.chats.find((chat) =>
        chat.participants.find((p) => p.userID === selectedContact.id)
      ) || null
    );
  }, [user.chats, selectedContact]);

  // Handle sending a message.
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

  // Allow sending the message on Enter key press (without Shift).
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
            {/* Chat messages display */}
            <div className="flex-1 flex flex-col gap-2 overflow-auto">
              {currentChat && currentChat.messages.length > 0 ? (
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
                            : selectedContact?.username}
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
