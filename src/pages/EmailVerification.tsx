import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Spinner } from "@heroui/react";


export const EmailVerification = () => {
  const { verifyUserEmail } = useUser();

  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [hasAttemptedVerify, setHasAttemptedVerify] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userID = queryParams.get("userID");
  const verifytoken = queryParams.get("verifytoken");

  useEffect(() => {
    if (!hasAttemptedVerify && userID && verifytoken) {
      (async () => {
        try {
          const res = await verifyUserEmail(userID, verifytoken);
          setResponse(res.message);
        } catch (err: any) {
          const errMsg =
            err.response?.data?.error || err.message || "Verification failed";
          setError(errMsg);
          
        } finally {
          setHasAttemptedVerify(true);
        }
      })();
    }
  }, [userID, verifytoken, hasAttemptedVerify, verifyUserEmail]);

  useEffect(() => {
    if ((response || error) && hasAttemptedVerify) {
      const timerId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            navigate("/home");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [response, error, navigate, hasAttemptedVerify]);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center text-center mt-8">
        <pre className={title({ color: "violet", size: "lg", fullWidth: true })}>
          {error ? error : response}
        </pre>
        {(response || error) && (
          <>
            <pre className={title({ color: "violet", size: "sm", fullWidth: true })}>
              Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
            </pre>
            <Spinner color="secondary" size="lg" variant="gradient" />
          </>
        )}
      </div>
    </DefaultLayout>
  );
};
