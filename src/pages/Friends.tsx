import { useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext } from "@/config/UserConfig";
import { Card } from "@heroui/card";
import { useFriends } from "@/hooks/useFriends";
import { Button } from "@heroui/button";
import { DeleteIcon, HeartFilledIcon } from "@/components/icons";

export const Friends = () => {
  const { user } = useContext(UserConfigContext)!;
  const { acceptRequest, deleteFriendRequest, friendState } = useFriends();
  const { friends, friendRequests } = friendState;
  return (
    <DefaultLayout>
      <div className="p-8">
        <h1>Friends</h1>
        <div className="mt-6">
          <h2>Friend List</h2>
          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            friends.map((friend) => (
              <Card key={friend.userID} className="p-4 my-2">
                <h3>{friend.username}</h3>
                <p>ID: {friend.userID}</p>
              </Card>
            ))
          )}
        </div>
        <div className="mt-6">
          <h2>Friend Requests</h2>
          {friendRequests.length === 0 ? (
            <p>No friend requests.</p>
          ) : (
            friendRequests.map((req) => (
              <Card key={req.userID} className="p-4 my-2">
                <h3>{req.username}</h3>
                <Button isIconOnly onPress={() => acceptRequest(req.userID)}>
                  <HeartFilledIcon />
                </Button>
                <Button isIconOnly onPress={() => deleteFriendRequest(req.userID)}>
                  <DeleteIcon />
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Friends;
