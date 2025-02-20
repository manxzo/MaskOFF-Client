import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";

// Types for comment data structure
interface Comment {
  author: {
    username: string;
  };
  content: string;
  createdAt: Date;
}

// Props for the CommentSection component
interface CommentSectionProps {
  postID: string;
  comments: Comment[];
  onSubmitComment: (postId: string, content: string) => Promise<void>;
}

/**
 * CommentSection Component
 * Displays a list of comments for a post and allows adding new comments
 */
export const CommentSection = ({ postID, comments, onSubmitComment }: CommentSectionProps) => {
  // State for managing comment section UI
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles the submission of a new comment
   * Clears the input and collapses the section after successful submission
   */
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
      {/* Comment toggle button with count */}
      <Button
        variant="light"
        onPress={() => setIsExpanded(!isExpanded)}
        className="text-sm"
      >
        {comments.length} Comments
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* New comment input form */}
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

          {/* List of existing comments */}
          {comments
            // DEBUG: Filter out bad comment data to prevent crashes
            // TODO: Need to clean up database - some comments have null authors
            .filter(comment => comment && comment.author)
            // Sort comments by date, newest first
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