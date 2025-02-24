import React, { useState, useEffect, useContext } from "react";
import { listUsers, createChat } from "@/services/services";
import useFriends from "@/hooks/useFriends";
import { GlobalConfigContext, Friend } from "@/config/GlobalConfig";
import DefaultLayout from "../layouts/default";
import { Tabs, Tab, Card, CardBody, CardFooter, Link, User, Button } from "@heroui/react";
import { HeartFilledIcon, DeleteIcon } from "../components/icons";
import { useNavigate } from "react-router-dom";

const FriendPage: React.FC = () => {
  const globalContext = useContext(GlobalConfigContext);
  if (!globalContext) {
    throw new Error("FriendPage must be used within a GlobalConfigProvider");
  }
  const { user,refresh } = globalContext;
  const friendRequestsSent = user?.friendRequestsSent;
  const friendRequestsReceived = user?.friendRequestsReceived;
  const friends = user?.friends;
  const { sendRequest, acceptRequest, rejectRequest } = useFriends();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<Friend[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await listUsers();
        setAllUsers(res.data.users || []);
        console.log(user);
        console.log(allUsers)
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [refresh]);

  
  if (!user || loadingUsers) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DefaultLayout>
    );
  }

 
  const getUserDetails = (userID: string) => {
    return allUsers.find(u => u.userID === userID) || { userID, username: "", name: "", avatar: "" };
  };

 
  const detailedFriendRequestsReceived = friendRequestsReceived?.map(fr => {
    const details = getUserDetails(fr.userID);
    return { ...fr, ...details };
  }) ?? [];

  const detailedFriendRequestsSent = friendRequestsSent?.map(fr => {
    const details = getUserDetails(fr.userID);
    return { ...fr, ...details };
  }) ?? [];
  const detailedFriends = friends?.map(fr => {
    const details = getUserDetails(fr.userID);
    return { ...fr, ...details };
  }) ?? [];
  const filteredFriends = allUsers?.filter(friend => {
    if (friend.userID === user.userID) return false;
    const alreadySent = friendRequestsSent.some(fr => fr.userID === friend.userID);
    const alreadyReceived = friendRequestsReceived.some(fr => fr.userID === friend.userID);
    const alreadyFriend = (friends ?? []).some(fr => fr.userID === friend.userID);
    return !alreadySent && !alreadyReceived && !alreadyFriend;
  }) ?? [];

  const handleSendRequest = (friendID: string) => {
    if (friendRequestsReceived.some(fr => fr.userID === friendID)) {
      acceptRequest(friendID);
    } else {
      sendRequest(friendID);
    }
  };

  const handleMessage = async (friendID: string) => {
    try {
      const res = await createChat(friendID);
      navigate(`/chat/${res.data.chatID}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <DefaultLayout>
      <Tabs aria-label="Friends">
        <Tab key="findUsers" title="Find Users">
          {filteredFriends.length === 0 ? (
            <p>No new users found.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredFriends.map(friend => (
                <Card key={friend.userID}>
                  <CardBody className="flex items-center justify-between">
                    <User
                      avatarProps={{
                        src: friend.avatar || undefined,
                        name: friend.name?.charAt(0) || friend.username?.charAt(0) || "U",
                        showFallback: true,
                      }}
                      description={
                        <Link href={`/profile/${friend.username}`} size="sm">
                          @{friend.username}
                        </Link>
                      }
                      name={friend.name}
                      className="flex-grow"
                    />
                    <Button onPress={() => handleSendRequest(friend.userID)} isIconOnly color="danger">
                      <HeartFilledIcon />
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </Tab>
        <Tab key="friendRequestsReceived" title="Friend Requests Received">
          {detailedFriendRequestsReceived.length === 0 ? (
            <p>No friend requests received.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {detailedFriendRequestsReceived.map(fr => (
                <Card key={fr.userID}>
                  <CardBody>
                    <User
                      avatarProps={{
                        src: fr.avatar || undefined,
                        name: fr.name?.charAt(0) || fr.username?.charAt(0) || "U",
                        showFallback: true,
                      }}
                      description={
                        <Link href={`/profile/${fr.username}`} size="sm">
                          @{fr.username}
                        </Link>
                      }
                      name={fr.name || "Unknown"}
                    />
                  </CardBody>
                  <CardFooter className="flex justify-around">
                    <Button onPress={() => acceptRequest(fr.userID)} color="success" isIconOnly>
                      <HeartFilledIcon />
                    </Button>
                    <Button onPress={() => rejectRequest(fr.userID)} color="danger" isIconOnly>
                      <DeleteIcon />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Tab>
        <Tab key="friendRequestsSent" title="Friend Requests Sent">
          {detailedFriendRequestsSent.length === 0 ? (
            <p>No friend requests sent.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {detailedFriendRequestsSent.map(fr => (
                <Card key={fr.userID}>
                  <CardBody>
                    <User
                      avatarProps={{
                        src: fr.avatar || undefined,
                        name: fr.name?.charAt(0) || fr.username?.charAt(0) || "U",
                        showFallback: true,
                      }}
                      description={
                        <Link href={`/profile/${fr.username}`} size="sm">
                          @{fr.username}
                        </Link>
                      }
                      name={fr.name}
                    />
                  </CardBody>
                  <CardFooter>
                    <p className="text-sm">Pending...</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Tab>
        <Tab key="friends" title="Friends">
          {detailedFriends?.length === 0 ? (
            <p>You have no friends yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {(detailedFriends ?? []).map(friend => (
                <Card key={friend.userID}>
                  <CardBody>
                    <User
                      avatarProps={{
                        src: friend.avatar || undefined,
                        name: friend.name?.charAt(0) || friend.username?.charAt(0) || "U",
                        showFallback: true,
                      }}
                      description={
                        <Link href={`/profile/${friend.username}`} size="sm">
                          @{friend.username}
                        </Link>
                      }
                      name={friend.name}
                    />
                  </CardBody>
                  <CardFooter className="flex justify-around">
                    <Button onPress={() => handleMessage(friend.userID)} color="primary">
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
};

export default FriendPage;
