// src/pages/Friends.tsx
import { useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext } from "@/config/UserConfig";
import { Card } from "@heroui/card";
import { useFriends } from "@/hooks/useFriends";
import { Button } from "@heroui/button";
import { DeleteIcon, HeartFilledIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";

export const Friends = () => {
  // Global user state provides the friend list and friendRequests.
  const { user } = useContext(UserConfigContext)!;
  // The useFriends hook manages additional operations and local friend state.
  const { acceptRequest, deleteFriendRequest,loading } = useFriends();
  const { friendRequests } = user;
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <div className="p-8">
        <h1>Friends</h1>
        {/* Friend List */}
        <div className="mt-6">
          <h2>Friend List</h2>
          {user.friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            user.friends.map((friend) => (
              <Card key={friend.userID} className="p-4 my-2 flex items-center justify-between">
                <div>
                  <h3>{friend.username}</h3>
                  <p>ID: {friend.userID}</p>
                </div>
                <div className="flex space-x-2">
                  {/* Accept and delete buttons can be here if needed for friend requests,
                      but for friend list we add a Message button */}
                  <Button
                    onPress={() =>
                      navigate("/messages", {
                        state: {
                          preselectedUser: {
                            id: friend.userID,
                            username: friend.username,
                          },
                        },
                      })
                    }
                  >
                    Message
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
        {/* Friend Requests */}
        <div className="mt-6">
          <h2>Friend Requests</h2>
          {friendRequests.length === 0 ? (
            <p>No friend requests.</p>
          ) : (
            friendRequests.map((req) => (
              <Card key={req.userID} className="p-4 my-2 flex items-center justify-between">
                <div>
                  <h3>{req.username}</h3>
                  <p>ID: {req.userID}</p>
                </div>
                <div className="flex space-x-2">
                  <Button isIconOnly onPress={() => acceptRequest(req.userID) && deleteFriendRequest(req.userID)} isLoading={loading}>
                    <HeartFilledIcon />
                  </Button>
                  <Button isIconOnly onPress={() => deleteFriendRequest(req.userID)} isLoading={loading}>
                    <DeleteIcon />
                  </Button>
                  {/* Optionally, also allow messaging from friend requests */}
                  <Button
                    onPress={() =>
                      navigate("/messages", {
                        state: {
                          preselectedUser: {
                            id: req.userID,
                            username: req.username,
                          },
                        },
                      })
                    }
                  >
                    Message
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Friends;
