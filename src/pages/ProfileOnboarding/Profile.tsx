import React, { useContext } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { UserConfigContext } from "@/config/UserConfig";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user } = useContext(UserConfigContext)!;
  const navigate = useNavigate();
  const profilePic = user.profilePicture;

  return (
    <DefaultLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <Avatar
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              className="w-32 h-32"
            />
          )}
          <h1 className="mt-4">Your Profile</h1>
        </div>
        <div className="mt-8">
          <p>
            <strong>Display Name:</strong> {user.username}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio || "No bio provided"}
          </p>
          <div className="mt-4">
            <strong>Skills:</strong>
            {user.skills && user.skills.length > 0 ? (
              <ul className="list-disc ml-5">
                {user.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills added.</p>
            )}
          </div>
          <div className="mt-4">
            <strong>Interests:</strong>
            {user.interests && user.interests.length > 0 ? (
              <ul className="list-disc ml-5">
                {user.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p>No interests added.</p>
            )}
          </div>
          <div className="mt-4">
            <strong>Privacy Settings:</strong>
            {user.privacy ? (
              <ul className="list-disc ml-5">
                <li>Profile Visibility: {user.privacy.profileVisibility}</li>
                <li>Messaging Preference: {user.privacy.messagingPreference}</li>
                <li>Friend Request Setting: {user.privacy.friendRequestSetting}</li>
              </ul>
            ) : (
              <p>No privacy settings configured.</p>
            )}
          </div>
        </div>
        <Button
          onPress={() => navigate("/profile/edit")}
          variant="solid"
          className="mt-6"
        >
          Edit Profile
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
