// --- ChatJobSettings.tsx ---
import { Button, Switch, Select, Input,SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
export const ChatJobSettings = ({
  selectedChat,
  handleJobSettingChange,
  jobUpdate,
  onJobSettingsUpdate,
  updateSettingsMode,
  setUpdateSettingsMode,
  onRemoveChat,
  loading,
  user,
}) => {
  const [isRevealed,setIsRevealed] = useState(false);


  useEffect(()=>{
    jobUpdate?.applicantAnonymous && setIsRevealed(!(jobUpdate?.applicantAnonymous))
  },[])

 if(loading) return(<></>);

if (!selectedChat || selectedChat.chatType !== "job")
    return (
      <div className="mt-2">
        <Button
          variant="ghost"
          color="danger"
          onPress={() => onRemoveChat(selectedChat.chatID)}
        >
          Delete Chat
        </Button>
      </div>
    );

  return (
    <div className="mt-2">
      <Button
        variant="solid"
        onPress={() => setUpdateSettingsMode(!updateSettingsMode)}
      >
        {updateSettingsMode ? "Cancel Update" : "Update Job Settings"}
      </Button>
      {updateSettingsMode && (
        <div className="p-4 border mt-2 space-y-3">
          <span className="mr-2">Reveal Applicant Identity:</span>
          <Switch
            name="applicantAnonymous"
            isSelected={isRevealed}
            onValueChange={setIsRevealed}
            isDisabled={selectedChat.transaction.applicantID !== user.userID}
            
          />
          
          <Select
            value={jobUpdate.status}
            name="status"
            onChange={handleJobSettingChange}
            placeholder="Select Status"
            label="Status"
          >
            <SelectItem key="">Select status</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="accepted">Accepted</SelectItem>
            <SelectItem key="completed">Completed</SelectItem>
          </Select>
          
          <Input
            type="number"
            onValueChange={handleJobSettingChange}
            value={jobUpdate.offerPrice}
            name="offerPrice"
            min={0}
            label="Offer:"
            startContent="$"
            
          />
          <Button onPress={()=>onJobSettingsUpdate(!isRevealed)}>Update Settings</Button>
        </div>
      )}

      {/* A button to delete the entire chat */}
      <div className="mt-2">
        <Button
          variant="ghost"
          color="danger"
          onPress={() => onRemoveChat(selectedChat.chatID)}
        >
          Delete Chat
        </Button>
      </div>
    </div>
  );
};
