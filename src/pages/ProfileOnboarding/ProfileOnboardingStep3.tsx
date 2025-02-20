import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

export const ProfileOnboardingStep3 = () => {
  const navigate = useNavigate();
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [messagingPreference, setMessagingPreference] = useState("everyone");
  const [friendRequestSetting, setFriendRequestSetting] = useState("everyone");

  const handleNext = () => {
    // save privacy settings to localstorage/global state
    localStorage.setItem("onboardingProfileVisibility", profileVisibility);
    localStorage.setItem("onboardingMessagingPreference", messagingPreference);
    localStorage.setItem("onboardingFriendRequestSetting", friendRequestSetting);
    navigate("/profile-onboarding/step4");
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1>Profile Onboarding - Privacy Preferences</h1>
        <p>Set your privacy settings for your profile.</p>
        
        <div className="mt-4">
          <h2 className="font-semibold">Profile Visibility</h2>
          <div className="mt-2 space-y-2">
            <label>
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={profileVisibility === "public"}
                onChange={(e) => setProfileVisibility(e.target.value)}
              />{" "}
              Public
            </label>
            <label>
              <input
                type="radio"
                name="profileVisibility"
                value="friends"
                checked={profileVisibility === "friends"}
                onChange={(e) => setProfileVisibility(e.target.value)}
              />{" "}
              Friends Only
            </label>
            <label>
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={profileVisibility === "private"}
                onChange={(e) => setProfileVisibility(e.target.value)}
              />{" "}
              Private
            </label>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">Messaging Preference</h2>
          <div className="mt-2 space-y-2">
            <label>
              <input
                type="radio"
                name="messagingPreference"
                value="everyone"
                checked={messagingPreference === "everyone"}
                onChange={(e) => setMessagingPreference(e.target.value)}
              />{" "}
              Everyone
            </label>
            <label>
              <input
                type="radio"
                name="messagingPreference"
                value="friends"
                checked={messagingPreference === "friends"}
                onChange={(e) => setMessagingPreference(e.target.value)}
              />{" "}
              Only Friends
            </label>
            <label>
              <input
                type="radio"
                name="messagingPreference"
                value="none"
                checked={messagingPreference === "none"}
                onChange={(e) => setMessagingPreference(e.target.value)}
              />{" "}
              No One
            </label>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">Friend Request Settings</h2>
          <div className="mt-2 space-y-2">
            <label>
              <input
                type="radio"
                name="friendRequestSetting"
                value="everyone"
                checked={friendRequestSetting === "everyone"}
                onChange={(e) => setFriendRequestSetting(e.target.value)}
              />{" "}
              Everyone
            </label>
            <label>
              <input
                type="radio"
                name="friendRequestSetting"
                value="friendsOfFriends"
                checked={friendRequestSetting === "friendsOfFriends"}
                onChange={(e) => setFriendRequestSetting(e.target.value)}
              />{" "}
              Friends of Friends
            </label>
            <label>
              <input
                type="radio"
                name="friendRequestSetting"
                value="none"
                checked={friendRequestSetting === "none"}
                onChange={(e) => setFriendRequestSetting(e.target.value)}
              />{" "}
              No One
            </label>
          </div>
        </div>

        <Button onPress={handleNext} variant="solid" className="mt-6">
          Next
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default ProfileOnboardingStep3;
