// src/pages/Home.tsx
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

const Home = () => {
  return (
    <DefaultLayout>
      <div className="p-8 text-center">
        <h1>Welcome to MASKoff</h1>
        <h3 className="mt-4">
          A platform for community, jobs, and direct messaging.
        </h3>
        <div className="mt-6 space-x-4">
          <Button as={Link} href="/login" variant="solid">
            Login
          </Button>
          <Button as={Link} href="/newuser" variant="shadow">
            Create User
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
