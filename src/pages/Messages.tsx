// src/pages/Messages.tsx
import React, { useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { Card, Button } from "@heroui/react";
import { Link } from "@heroui/link";
import { UserConfigContext } from "@/config/UserConfig";

export const Messages = () => {
  const { user } = useContext(UserConfigContext)!;
  return (
    <DefaultLayout>
      <div className="p-8">
        <h1>Messages</h1>
        {user.chats.length === 0 ? (
          <p>No chats available.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {user.chats.map((chat) => (
              <Card key={chat.chatID} className="p-4">
                <h3>
                  Chat with{" "}
                  {chat.participants
                    .filter((id: string) => id !== user.userID)
                    .join(", ")}
                </h3>
                {chat.messages.length > 0 && (
                  <p>
                    Latest: {chat.messages[chat.messages.length - 1].message}
                  </p>
                )}
                <Button as={Link} href={`/messages?chat=${chat.chatID}`} variant="solid">
                  Open Chat
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
