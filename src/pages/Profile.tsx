import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalConfigContext } from "@/config/GlobalConfig";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, Spinner } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import axios from "axios";

interface PublicProfileResponse {
  user: {
    name: string;
    username: string;
    avatar?: string; // ensure avatar is available if provided
  };
  profile: {
    publicInfo: {
      bio: string;
      skills: string[];
      achievements: string[];
      portfolio: string;
    };
  };
}

const Profile = () => {
  const { username } = useParams<{ username: string | null }>();
  const { user } = useContext(GlobalConfigContext)!;
  const [profileData, setProfileData] = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (username) {
          const res = await axios.get<PublicProfileResponse>(`http://${import.meta.env.VITE_APP_SERVER_URL}/api/user/by-username/${username}`);
          setProfileData(res.data);
        } else if (user && user.profile) {
          setProfileData({
            user: {
              name: user.name,
              username: user.username,
              avatar: user.avatar, // use avatar from context
            },
            profile: {
              publicInfo: {
                bio: user.profile.publicInfo.bio,
                skills: user.profile.publicInfo.skills,
                achievements: user.profile.publicInfo.achievements,
                portfolio: user.profile.publicInfo.portfolio,
              },
            },
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, user]);

  return (
    <DefaultLayout>
      <div className="p-8">
        {loading ? (
          <Spinner size="lg" />
        ) : profileData ? (
          <Card>
            <CardBody>
              {profileData.user.avatar && (
                <img
                  src={profileData.user.avatar}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full mb-4"
                />
              )}
              <h1 className={title({ size: "lg", color: "cyan", fullWidth: true })}>
                {profileData.user.name} (@{profileData.user.username})
              </h1>
              <p className={subtitle({ fullWidth: true })}>
                Bio: {profileData.profile.publicInfo.bio || "No bio provided."}
              </p>
              {profileData.profile.publicInfo.skills && (
                <p>Skills: {profileData.profile.publicInfo.skills.join(", ")}</p>
              )}
              {profileData.profile.publicInfo.achievements && (
                <p>Achievements: {profileData.profile.publicInfo.achievements.join(", ")}</p>
              )}
              {profileData.profile.publicInfo.portfolio && (
                <p>Portfolio: {profileData.profile.publicInfo.portfolio}</p>
              )}
            </CardBody>
          </Card>
        ) : (
          <p>Profile not found.</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Profile;
