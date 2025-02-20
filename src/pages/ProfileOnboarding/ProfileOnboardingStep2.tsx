import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

const ProfileOnboardingStep2 = () => {
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const newSkills = [...skills, trimmedSkill];
      console.log("Adding skill:", newSkills);
      setSkills(newSkills);
      setSkillInput("");
    }
  };

  const handleAddInterest = () => {
    const trimmedInterest = interestInput.trim();
    if (trimmedInterest && !interests.includes(trimmedInterest)) {
      const newInterests = [...interests, trimmedInterest];
      console.log("Adding interest:", newInterests);
      setInterests(newInterests);
      setInterestInput("");
    }
  };

  const handleNext = () => {
    localStorage.setItem("onboardingSkills", JSON.stringify(skills));
    localStorage.setItem("onboardingInterests", JSON.stringify(interests));
    navigate("/profile-onboarding/step3");
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-md mx-auto">
        <h1 className="mb-4">Profile Onboarding - Skills & Interests</h1>
        <p className="mb-6">
          Add your skills and interests to help us recommend relevant opportunities.
        </p>
        <div className="mb-6">
          <Input
            label="Add Skill"
            id="onboard-skill-input"
            placeholder="Type a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <Button onPress={handleAddSkill} variant="solid" className="mt-2 bg-orange-500">
            Add Skill
          </Button>
          {skills.length > 0 && (
            <ul className="mt-2 space-y-1">
              {skills.map((skill, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-white"
                >
                  <span>{skill}</span>
                  <Button
                    onPress={() => setSkills(skills.filter((s) => s !== skill))}
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
        <div className="mb-6">
          <Input
            label="Add Interest"
            id="onboard-interest-input"
            placeholder="Type an interest"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
          />
          <Button onPress={handleAddInterest} variant="solid" className="mt-2 bg-orange-500">
            Add Interest
          </Button>
          {interests.length > 0 && (
            <ul className="mt-2 space-y-1">
              {interests.map((interest, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-white"
                >
                  <span>{interest}</span>
                  <Button
                    onPress={() => setInterests(interests.filter((i) => i !== interest))}
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
        <Button onPress={handleNext} variant="solid" className="mt-6 bg-blue-500">
          Next
        </Button>
      </div>
    </DefaultLayout>
  );
};

export default ProfileOnboardingStep2;
