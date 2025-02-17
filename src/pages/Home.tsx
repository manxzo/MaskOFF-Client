// src/pages/Home.tsx
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { subtitle, title } from "@/components/primitives";
const Home = () => {
  return (
    <DefaultLayout>
      <div className="p-8 text-center">
        <pre className={title({ color: "violet", size: "lg", fullWidth: true })}>Welcome to MASKoff</pre>
        <pre  className={`mt-4 ${subtitle({fullWidth:true})}`}>
          A platform for community, jobs, and direct messaging.
        </pre>
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
