import React, { useContext, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { UserConfigContext } from "@/config/UserConfig";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const { user, setUser } = useContext(UserConfigContext)!;
  const navigate = useNavigate();

  const initialDisplayName = user.username || localStorage.getItem("onboardingDisplayName") || "";
  const initialBio = user.bio || localStorage.getItem("onboardingBio") || "";
  const initialSkills = user.skills || JSON.parse(localStorage.getItem("onboardingSkills") || "[]");
  const initialInterests = user.interests || JSON.parse(localStorage.getItem("onboardingInterests") || "[]");
  const initialPrivacy = user.privacy || {
    profileVisibility: localStorage.getItem("onboardingProfileVisibility") || "public",
    messagingPreference: localStorage.getItem("onboardingMessagingPreference") || "everyone",
    friendRequestSetting: localStorage.getItem("onboardingFriendRequestSetting") || "everyone",
  };

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [profilePicture, setProfilePicture] = useState<string>(user.profilePicture || "");
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [newInterest, setNewInterest] = useState("");
  const [privacy, setPrivacy] = useState(initialPrivacy);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSave = () => {
    setUser({
      ...user,
      username: displayName,
      bio,
      profilePicture,
      skills,
      interests,
      privacy,
    });
    navigate("/profile");
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1>Edit Profile</h1>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="editDisplayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <Input
              id="editDisplayName"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="editBio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <Input
              id="editBio"
              placeholder="Enter your bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="editProfilePicture" className="block text-sm font-medium text-gray-700">
              Profile Picture (optional)
            </label>
            <input id="editProfilePicture" type="file" accept="image/*" onChange={handleFileChange} />
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile Preview"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <label htmlFor="editSkillInput" className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <div className="flex gap-2">
              <Input
                id="editSkillInput"
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button onPress={addSkill} variant="solid" className="bg-orange-500">
                Add Skill
              </Button>
            </div>
            {skills.length > 0 && (
              <ul className="list-disc ml-5 mt-2">
                {skills.map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-white"
                  >
                    <span>{skill}</span>
                    <Button
                      onPress={() => removeSkill(skill)}
                      variant="flat"
                      className="text-red-500 hover:text-red-700 hover:border hover:border-red-700"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="editInterestInput" className="block text-sm font-medium text-gray-700">
              Interests
            </label>
            <div className="flex gap-2">
              <Input
                id="editInterestInput"
                placeholder="Add an interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
              />
              <Button onPress={addInterest} variant="solid" className="bg-orange-500">
                Add Interest
              </Button>
            </div>
            {interests.length > 0 && (
              <ul className="list-disc ml-5 mt-2">
                {interests.map((interest, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-white"
                  >
                    <span>{interest}</span>
                    <Button
                      onPress={() => removeInterest(interest)}
                      variant="flat"
                      className="text-red-500 hover:text-red-700 hover:border hover:border-red-700"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <fieldset className="mt-2 border border-transparent">
            <legend className="block text-sm font-medium text-gray-700">
              Privacy Settings
            </legend>
            <div className="mt-2">
              <p className="font-semibold">Profile Visibility:</p>
              <div>
                <label htmlFor="pv-public" className="mr-4">
                  <input
                    id="pv-public"
                    type="radio"
                    name="profileVisibility"
                    value="public"
                    checked={privacy.profileVisibility === "public"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, profileVisibility: e.target.value })
                    }
                  />{" "}
                  Public
                </label>
                <label htmlFor="pv-friends" className="mr-4">
                  <input
                    id="pv-friends"
                    type="radio"
                    name="profileVisibility"
                    value="friends"
                    checked={privacy.profileVisibility === "friends"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, profileVisibility: e.target.value })
                    }
                  />{" "}
                  Friends Only
                </label>
                <label htmlFor="pv-private">
                  <input
                    id="pv-private"
                    type="radio"
                    name="profileVisibility"
                    value="private"
                    checked={privacy.profileVisibility === "private"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, profileVisibility: e.target.value })
                    }
                  />{" "}
                  Private
                </label>
              </div>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Messaging Preference:</p>
              <div>
                <label htmlFor="mp-everyone" className="mr-4">
                  <input
                    id="mp-everyone"
                    type="radio"
                    name="messagingPreference"
                    value="everyone"
                    checked={privacy.messagingPreference === "everyone"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, messagingPreference: e.target.value })
                    }
                  />{" "}
                  Everyone
                </label>
                <label htmlFor="mp-friends" className="mr-4">
                  <input
                    id="mp-friends"
                    type="radio"
                    name="messagingPreference"
                    value="friends"
                    checked={privacy.messagingPreference === "friends"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, messagingPreference: e.target.value })
                    }
                  />{" "}
                  Friends Only
                </label>
                <label htmlFor="mp-none">
                  <input
                    id="mp-none"
                    type="radio"
                    name="messagingPreference"
                    value="none"
                    checked={privacy.messagingPreference === "none"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, messagingPreference: e.target.value })
                    }
                  />{" "}
                  No One
                </label>
              </div>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Friend Request Setting:</p>
              <div>
                <label htmlFor="frs-everyone" className="mr-4">
                  <input
                    id="frs-everyone"
                    type="radio"
                    name="friendRequestSetting"
                    value="everyone"
                    checked={privacy.friendRequestSetting === "everyone"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, friendRequestSetting: e.target.value })
                    }
                  />{" "}
                  Everyone
                </label>
                <label htmlFor="frs-fof" className="mr-4">
                  <input
                    id="frs-fof"
                    type="radio"
                    name="friendRequestSetting"
                    value="friendsOfFriends"
                    checked={privacy.friendRequestSetting === "friendsOfFriends"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, friendRequestSetting: e.target.value })
                    }
                  />{" "}
                  Friends of Friends
                </label>
                <label htmlFor="frs-none">
                  <input
                    id="frs-none"
                    type="radio"
                    name="friendRequestSetting"
                    value="none"
                    checked={privacy.friendRequestSetting === "none"}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, friendRequestSetting: e.target.value })
                    }
                  />{" "}
                  No One
                </label>
              </div>
            </div>
          </fieldset>
          <Button onPress={handleSave} variant="solid" className="mt-6 bg-blue-500">
            Save
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfileEdit;
