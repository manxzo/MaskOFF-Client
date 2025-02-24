import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  Input,
  Spinner,
  addToast
} from "@heroui/react";
import { title } from "@/components/primitives";
import useUser from "@/hooks/useUser";
import DefaultLayout from "@/layouts/default";


export const ResetPasswordForm = () => {
  const { resetPwd } = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userID = queryParams.get("userID");
  const token = queryParams.get("token");
  const username = queryParams.get("username");

  const [form, setForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.newPassword !== form.confirmNewPassword) {
      const errMsg = "Passwords do not match!";
      addToast({ title: errMsg, color: "danger", size: "lg" });
      return;
    }
    setLoading(true);
    try {
      const res = await resetPwd({
        userID,
        token,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });
      const successMsg = res.message || "Password reset successfully.";
      setMessage(successMsg);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Reset password failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((message || error) && countdown > 0) {
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
  }, [message, error, countdown, navigate]);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center text-center mt-8">
        <Card className="max-w-md mx-auto text-center items-center">
          <CardHeader>
            <h2 className={title({ size: "md", color: "violet", fullWidth: true })}>
              Reset Password
            </h2>
          </CardHeader>
          <CardBody>
            {error && <pre className="text-red-500 mb-2 text-md">{error}</pre>}
            {message && <pre className="text-green-500 mb-2 text-md">{message}</pre>}
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input isRequired label="Username" value={username} disabled />
              <Input
                isRequired
                label="New Password"
                placeholder="Enter your new password"
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
              />
              <Input
                isRequired
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                type="password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
              />
              <Button type="submit" color="primary" isLoading={loading}>
                Reset Password
              </Button>
            </Form>
          </CardBody>
        </Card>
        {(message || error) && (
          <div className="mt-8">
            <pre className={title({ color: "violet", size: "sm" })}>
              Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
            </pre>
            <Spinner color="secondary" size="lg" variant="gradient" />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
