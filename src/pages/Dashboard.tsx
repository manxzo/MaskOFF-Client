import { useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { UserConfigContext } from "@/config/UserConfig";
import { Feed } from "@/components/Feed";
import useWebSocket from "@/hooks/useWebSocket"; // Import the WS hook

export const Dashboard = () => {
  const { user } = useContext(UserConfigContext)!;

  // If the user is logged in (has a userID), set up the WebSocket connection.
  // This ensures that the WS connection is active in a top-level page.
  useWebSocket(user.userID);

  return (
    <DefaultLayout>
      <div className="p-8 text-center">
        <h1>Dashboard</h1>
        <p className="mt-2">Welcome back, {user.username}!</p>
        <div className="mt-6 space-x-4">
          <Button as={Link} href="/find-users" variant="solid">
            Find Users
          </Button>
          <Button as={Link} href="/friends" variant="shadow">
            Friend List
          </Button>
          <Button as={Link} href="/messages" variant="ghost">
            Messages
          </Button>
        </div>
      </div>
      <div>
      <Feed />
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
