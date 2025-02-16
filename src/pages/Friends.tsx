// src/pages/Friends.tsx
import { useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext } from "@/config/UserConfig";
import {Card} from '@heroui/react'
export const Friends = () => {
  const { user } = useContext(UserConfigContext)!;
  return (
    <DefaultLayout>
      <div className="p-8">
        <h1>Friends</h1>
        <div className="mt-6">
          <h2>Friend List</h2>
          {user.friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            user.friends.map((friend) => (
              <Card key={friend.userID} className="p-4 my-2">
                <h3>{friend.username}</h3>
                <p>ID: {friend.userID}</p>
              </Card>
            ))
          )}
        </div>
        <div className="mt-6">
          <h2>Friend Requests</h2>
          {user.friendRequests.length === 0 ? (
            <p>No friend requests.</p>
          ) : (
            user.friendRequests.map((req) => (
              <Card key={req.userID} className="p-4 my-2">
                <h3>{req.username}</h3>
                <p>ID: {req.userID}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};
