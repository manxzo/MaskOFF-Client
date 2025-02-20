import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";

interface Comment {
  author: {
    username: string;
  };
  content: string;
  createdAt: Date;
}

interface CommentSectionProps {
  postID: string;
  comments: Comment[];
  onSubmitComment: (postId: string, content: string) => Promise<void>;
}

export const CommentSection = ({ postID, comments, onSubmitComment }: CommentSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(postID, newComment);
      setNewComment("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        variant="light"
        onPress={() => setIsExpanded(!isExpanded)}
        className="text-sm"
      >
        {comments.length} Comments
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow"
            />
            <Button
              color="primary"
              size="sm"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={!newComment.trim()}
            >
              Post
            </Button>
          </div>

          {comments
            .filter(comment => comment && comment.author)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((comment, index) => (
              <Card key={index} className="bg-default-50">
                <CardBody className="py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {comment.author.username}
                    </span>
                    <span className="text-xs text-default-400">
                      • {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </CardBody>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}; 