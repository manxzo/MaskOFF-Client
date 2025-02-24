import { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Textarea,
  Button,
  addToast
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalConfigContext } from "@/config/GlobalConfig";

const OnboardingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, setUser } = useContext(GlobalConfigContext)!;
  const navigate = useNavigate();
  const [bio, setBio] = useState(user?.profile?.publicInfo?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.publicInfo?.skills?.join(", ") || "");
  const [achievements, setAchievements] = useState(
    user?.profile?.publicInfo?.achievements?.join(", ") || ""
  );
  const [portfolio, setPortfolio] = useState(user?.profile?.publicInfo?.portfolio || "");
  const [loading, setLoading] = useState(false);

  // handle submit: update profile then navigate to profile page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/api/profile/${user?.userID}`, {
        publicInfo: {
          bio,
          skills: skills.split(",").map((s) => s.trim()),
          achievements: achievements.split(",").map((s) => s.trim()),
          portfolio,
        },
      });
      setUser({ ...user, profile: res.data.profile });
      addToast({ title: "profile updated", color: "success" });
      onClose();
      navigate("/profile");
    } catch (err: any) {
      console.error("error updating onboarding:", err);
      addToast({ title: err.message || "update failed", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  // handle skip: close modal + navigate to profile page
  const handleSkip = () => {
    onClose();
    navigate("/profile");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        {(_onCloseModal) => (
          <div className="p-4">
            <ModalHeader>onboarding</ModalHeader>
            <ModalBody>
              <p>update your profile details (optional).</p>
              <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Textarea
                  label="Bio"
                  placeholder="enter your bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Input
                  label="Skills"
                  placeholder="comma-separated list of skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <Input
                  label="Achievements"
                  placeholder="comma-separated list of achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                />
                <Input
                  label="Portfolio"
                  placeholder="enter portfolio link or details"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button type="button" onPress={handleSkip} variant="flat" color="danger">
                    skip for now
                  </Button>
                  <Button type="submit" color="primary" isLoading={loading}>
                    submit
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OnboardingModal;
