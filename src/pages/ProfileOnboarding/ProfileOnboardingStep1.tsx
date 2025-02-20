import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

const ProfileOnboardingStep1 = () => {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      // convert file base64 data URL for previewing
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!displayName.trim()) {
      alert("Please enter a display name");
      return;
    }
    // save non-image fields to localstorage for persistence (if need)
    localStorage.setItem("onboardingDisplayName", displayName);
    localStorage.setItem("onboardingBio", bio);
    navigate("/profile-onboarding/step2");
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1>Profile Onboarding - Basic Info</h1>
        <p>Please provide your basic profile information.</p>
        <div className="mt-4 space-y-4">
          <Input
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            label="Bio"
            placeholder="A short bio (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          <Button onPress={handleNext} variant="solid">
            Next
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfileOnboardingStep1;