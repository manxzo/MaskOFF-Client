// ChatJobSettings.tsx
import { Button } from "@heroui/button";

interface ChatJobSettingsProps {
  selectedChat: any;
  updateSettingsMode: boolean;
  setUpdateSettingsMode: (val: boolean) => void;
  jobUpdate: any;
  setJobUpdate: (data: any) => void;
  handleJobSettingsUpdate: () => void;
  removeChat: (chatID: string) => void;
}

const ChatJobSettings = ({
  selectedChat,
  updateSettingsMode,
  setUpdateSettingsMode,
  jobUpdate,
  setJobUpdate,
  handleJobSettingsUpdate,
  removeChat,
}: ChatJobSettingsProps) => {
  if (!selectedChat || selectedChat.chatType !== "job") return null;
  return (
    <>
      <Button
        variant="solid"
        onPress={() => setUpdateSettingsMode(!updateSettingsMode)}
      >
        {updateSettingsMode ? "Cancel Update" : "Update Job Settings"}
      </Button>
      {updateSettingsMode && (
        <div className="p-4 border mt-2">
          <label className="block mb-2">
            Reveal Applicant Identity:
            <input
              type="checkbox"
              onChange={(e) =>
                setJobUpdate((prev: any) => ({
                  ...prev,
                  revealIdentity: e.target.checked,
                }))
              }
              className="ml-2"
            />
          </label>
          <label className="block mb-2">
            Status:
            <select
              onChange={(e) =>
                setJobUpdate((prev: any) => ({ ...prev, status: e.target.value }))
              }
              className="ml-2"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="block mb-2">
            Offer Price:
            <input
              type="number"
              onChange={(e) =>
                setJobUpdate((prev: any) => ({
                  ...prev,
                  offerPrice: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>
          <Button onPress={handleJobSettingsUpdate}>Update Settings</Button>
        </div>
      )}
      <Button variant="ghost" onPress={() => removeChat(selectedChat.chatID)}>
        Delete Chat
      </Button>
    </>
  );
};

export default ChatJobSettings;
