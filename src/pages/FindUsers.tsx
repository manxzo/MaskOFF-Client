// src/pages/FindUsers.tsx
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Card } from "@heroui/card";
import { retrieveAllUsers } from "@/services/services";

export const FindUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await retrieveAllUsers();
        setUsers(allUsers);
      } catch (err: any) {
        setError(err.message || "Error retrieving users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <DefaultLayout>
      <div className="p-8">
        <h1>Find Users</h1>
        {loading && <p>Loading...</p>}
        {error && <p color="danger">{error}</p>}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.userID} className="p-4">
              <h1>{user.username}</h1>
              <p>ID: {user.userID}</p>
            </Card>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};
