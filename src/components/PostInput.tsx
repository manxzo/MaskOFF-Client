import { useState, useContext } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Avatar } from "@heroui/avatar";
import { UserConfigContext } from "@/config/UserConfig";

interface PostInputProps {
  type: "intros" | "posts";
  onSubmit: (data: { title?: string; content: string; isJob?: boolean }) => Promise<void>;
}

export const PostInput = ({ type, onSubmit }: PostInputProps) => {
  const { user } = useContext(UserConfigContext)!;
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isJob, setIsJob] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // look first in the user context for a profilePicture
  const avatarSrc =
    user.profilePicture ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`;

  const handleSubmit = async () => {
    if (!content.trim() || (type === "posts" && !title.trim())) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: type === "posts" ? title : undefined,
        content,
        isJob: type === "posts" ? isJob : undefined,
      });
      setContent("");
      setTitle("");
      setIsJob(false);
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <div className="flex gap-3">
          <Avatar src={avatarSrc} className="h-10 w-10" />
          <div className="w-full">
            {type === "posts" && (
              <Input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3"
              />
            )}
            <Input
              type="text"
              placeholder={type === "intros" ? "Introduce yourself..." : "What's on your mind?"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        {type === "posts" && (
          <div className="flex items-center gap-2">
            <Switch size="sm" isSelected={isJob} onValueChange={setIsJob} />
            <span className="text-sm">Job post</span>
          </div>
        )}
        <Button
          color="primary"
          onPress={handleSubmit}
          isDisabled={!content.trim() || (type === "posts" && !title.trim())}
          isLoading={isSubmitting}
        >
          {type === "intros" ? "Share" : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};
