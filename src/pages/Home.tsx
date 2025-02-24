import DefaultLayout from "@/layouts/default";
import { subtitle, title } from "@/components/primitives";

const Home = () => {
  return (
    <DefaultLayout>
      <div className="p-8 text-center">
        <pre className={title({ color: "violet", size: "lg", fullWidth: true })}>
          Welcome to MASKoff
        </pre>
        <pre className={`mt-4 ${subtitle({ fullWidth: true })}`}>
          MASKoff is a platform for community, jobs, and direct messaging.
        </pre>
        <pre>
          To get started, please click on "Login/Register" in the navigation bar.
        </pre>
      </div>
    </DefaultLayout>
  );
};

export default Home;
