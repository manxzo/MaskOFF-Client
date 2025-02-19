// src/pages/FindUsers.tsx
import { useEffect, useState, useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { Card } from "@heroui/card";
import { retrieveAllUsers } from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";
import { Button } from "@heroui/button";
import { HeartFilledIcon } from "@/components/icons";
import { useFriends } from "@/hooks/useFriends";
import { useNavigate } from "react-router-dom";

export const FindUsers = () => {
  const [allUsers, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { user: currentUser } = useContext(UserConfigContext)!;
  const { sendRequest } = useFriends();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await retrieveAllUsers();
        const filteredUsers = res.filter(
          (user) => user.userID !== currentUser?.userID
        );
        setUsers(filteredUsers);
      } catch (err: any) {
        setError(err.message || "Error retrieving users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <DefaultLayout>
      <div className="p-8">
        <h1>Find Users</h1>
        {loading && <p>Loading...</p>}
        {error && <p color="danger">{error}</p>}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allUsers.map((user) => (
            <Card key={user.userID} className="p-4">
              <h1>{user.username}</h1>
              <div className="flex space-x-2">
                <Button
                  isIconOnly
                  color="danger"
                  onPress={() => sendRequest(user.userID)}
                >
                  <HeartFilledIcon />
                </Button>
                {/* New Message button that navigates to /messages with preselectedUser in state */}
                <Button
                  onPress={() =>
                    navigate("/messages", {
                      state: {
                        preselectedUser: {
                          id: user.userID,
                          username: user.username,
                        },
                      },
                    })
                  }
                >
                  Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FindUsers;
