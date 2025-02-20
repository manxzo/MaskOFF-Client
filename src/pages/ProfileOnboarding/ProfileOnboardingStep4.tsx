import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

const ProfileOnboardingStep4 = () => {
  const navigate = useNavigate();

  // Retrieve stored values for non-image fields
  const storedDisplayName = localStorage.getItem("onboardingDisplayName") || "";
  const storedBio = localStorage.getItem("onboardingBio") || "";
  const storedSkills = JSON.parse(localStorage.getItem("onboardingSkills") || "[]");
  const storedInterests = JSON.parse(localStorage.getItem("onboardingInterests") || "[]");
  const storedPrivacy = {
    profileVisibility: localStorage.getItem("onboardingProfileVisibility") || "public",
    messagingPreference: localStorage.getItem("onboardingMessagingPreference") || "everyone",
    friendRequestSetting: localStorage.getItem("onboardingFriendRequestSetting") || "everyone",
  };

  // For the profile image, since we didn't store it in Step 1 (to avoid quota issues),
  // allow the user to upload or change it here.
  const storedImage = localStorage.getItem("onboardingProfilePicture") || "";
  const [profileImage, setProfileImage] = useState<string>(storedImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    // save the updated profile image if provided
    if (profileImage) {
      localStorage.setItem("onboardingProfilePicture", profileImage);
    }
    navigate("/profile");
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1 className="mb-4">Review & Confirm Your Profile</h1>
        <div className="mb-6">
          <div className="flex flex-col items-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                Default
              </div>
            )}
            <label
              htmlFor="reviewProfileImage"
              className="mt-2 block text-sm font-medium text-gray-700"
            >
              Update Profile Image
            </label>
            <input
              id="reviewProfileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <p className="mt-4">
            <strong>Display Name:</strong> {storedDisplayName}
          </p>
          <p className="mt-2">
            <strong>Bio:</strong> {storedBio}
          </p>
          <div className="mt-2">
            <strong>Skills:</strong>
            {storedSkills.length > 0 ? (
              <ul className="list-disc ml-5">
                {storedSkills.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills added.</p>
            )}
          </div>
          <div className="mt-2">
            <strong>Interests:</strong>
            {storedInterests.length > 0 ? (
              <ul className="list-disc ml-5">
                {storedInterests.map((interest: string, idx: number) => (
                  <li key={idx}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p>No interests added.</p>
            )}
          </div>
          <div className="mt-2">
            <strong>Privacy Settings:</strong>
            <ul className="list-disc ml-5">
              <li>Profile Visibility: {storedPrivacy.profileVisibility}</li>
              <li>Messaging Preference: {storedPrivacy.messagingPreference}</li>
              <li>Friend Request Setting: {storedPrivacy.friendRequestSetting}</li>
            </ul>
          </div>
        </div>
        <Button onPress={handleConfirm} variant="solid" className="bg-blue-500">
          Confirm &amp; Create Profile
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default ProfileOnboardingStep4;
