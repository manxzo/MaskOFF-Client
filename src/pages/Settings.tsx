import { useState, useContext, useEffect } from "react";
import { GlobalConfigContext } from "@/config/GlobalConfig";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Button, Input, Textarea, addToast } from "@heroui/react";
import { title } from "@/components/primitives";
import { updateProfile, uploadAvatar } from "@/services/services";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, setUser } = useContext(GlobalConfigContext)!;
  const navigate = useNavigate();
  const [bio, setBio] = useState(user?.profile?.publicInfo?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.publicInfo?.skills?.join(", ") || "");
  const [achievements, setAchievements] = useState(user?.profile?.publicInfo?.achievements?.join(", ") || "");
  const [portfolio, setPortfolio] = useState(user?.profile?.publicInfo?.portfolio || "");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (user && user.profile) {
      setBio(user.profile.publicInfo.bio || "");
      setSkills(user.profile.publicInfo.skills?.join(", ") || "");
      setAchievements(user.profile.publicInfo.achievements?.join(", ") || "");
      setPortfolio(user.profile.publicInfo.portfolio || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(user?.userID, {
        publicInfo: {
          bio,
          skills: skills.split(",").map((s) => s.trim()),
          achievements: achievements.split(",").map((s) => s.trim()),
          portfolio,
        },
      });
      setUser({ ...user, profile: res.data.profile });
      addToast({ title: "Settings Updated", color: "success" });
      navigate("/profile");
    } catch (err: any) {
      console.error("error updating settings:", err);
      addToast({ title: err.message || "Update Failed", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // handle avatar selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // upload avatar and update user state; using import.meta.env instead of process.env
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setLoading(true);
    try {
      await uploadAvatar(avatarFile);
      setUser({
        ...user,
        avatar: `${`http://${import.meta.env.VITE_API_SERVER_URL}/api` || "http://localhost:3000/api"}/avatar/${user?.userID}`,
      });
      addToast({ title: "Avatar Updated", color: "success" });
    } catch (err: any) {
      console.error("avatar upload error:", err.response?.data || err.message);
      addToast({ title: "Avatar Upload Failed", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className={title({ size: "lg", color: "green", fullWidth: true })}>
              Profile Settings
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* avatar section */}
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar preview" className="w-24 h-24 rounded-full mb-2" />
                ) : user?.avatar ? (
                  <img src={user.avatar} alt="user avatar" className="w-24 h-24 rounded-full mb-2" />
                ) : null}
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                <Button type="button" onPress={handleAvatarUpload} color="primary" isLoading={loading}>
                  Upload Avatar
                </Button>
              </div>

              {/* bio section */}
              <Textarea
                label="Bio"
                placeholder="Enter your bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Input
                label="Skills"
                placeholder="Comma-separated list of skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <Input
                label="Achievements"
                placeholder="Comma-separated list of achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
              />
              <Input
                label="Portfolio"
                placeholder="Enter portfolio link or details"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
              <Button type="submit" color="primary" isLoading={loading}>
                Save Settings
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
