import { useState, useContext, useEffect } from "react";
import { GlobalConfigContext } from "@/config/GlobalConfig";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Button, Input, Textarea, Switch, addToast } from "@heroui/react";
import { title } from "@/components/primitives";
import { updateProfile, uploadAvatar, deleteAvatar } from "@/services/services";
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
  const [privacy, setPrivacy] = useState(user?.profile?.privacy || false);

  // update state when user changes
  useEffect(() => {
    if (user && user.profile) {
      setBio(user.profile.publicInfo.bio || "");
      setSkills(user.profile.publicInfo.skills?.join(", ") || "");
      setAchievements(user.profile.publicInfo.achievements?.join(", ") || "");
      setPortfolio(user.profile.publicInfo.portfolio || "");
      setPrivacy(user.profile.privacy || false);
    }
  }, [user]);

  // handle form submit including privacy toggle
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
        privacy,
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

  // upload avatar and update user state
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setLoading(true);
    try {
      await uploadAvatar(avatarFile);
      setUser({
        ...user,
        avatar: `${`https://${import.meta.env.VITE_API_SERVER_URL}/api` || "https://localhost:3000/api"}/avatar/${user?.userID}`,
      });
      addToast({ title: "Avatar Updated", color: "success" });
    } catch (err: any) {
      console.error("avatar upload error:", err.response?.data || err.message);
      addToast({ title: "Avatar Upload Failed", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // handle avatar deletion to revert back to default image
  const handleAvatarDelete = async () => {
    setLoading(true);
    try {
      await deleteAvatar(user?.userID);
      // clear avatar in state
      setUser({ ...user, avatar: undefined });
      addToast({ title: "Avatar Deleted", color: "success" });
    } catch (err: any) {
      console.error("avatar delete error:", err.response?.data || err.message);
      addToast({ title: "Avatar Deletion Failed", color: "danger" });
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
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar
                </label>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar preview" className="w-24 h-24 rounded-full mb-2" />
                ) : user?.avatar ? (
                  <img src={user.avatar} alt="user avatar" className="w-24 h-24 rounded-full mb-2" />
                ) : null}
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                <div className="flex gap-2 mt-2">
                  <Button type="button" onPress={handleAvatarUpload} color="primary" isLoading={loading}>
                    Upload Avatar
                  </Button>
                  <Button type="button" onPress={handleAvatarDelete} color="danger" isLoading={loading}>
                    Delete Avatar
                  </Button>
                </div>
              </div>
              {/* toggle section */}
              <div className="flex items-center gap-2">
                <Switch isSelected={privacy} onChange={() => setPrivacy(!privacy)}>
                  {privacy ? "MASKon" : "MASKoff"}
                </Switch>
                <span className="text-sm text-gray-700">Toggle Profile Visibility</span>
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