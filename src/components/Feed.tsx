import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import {
  createPost,
  getPosts,
  createIntroduction,
  getIntroductions,
  type Post,
  type Introduction,
} from "@/services/services";

export const Feed = () => {
  const [activeTab, setActiveTab] = useState<"intros" | "posts">("posts");
  const [showOnlyJobs, setShowOnlyJobs] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isJobPost, setIsJobPost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [introductions, setIntroductions] = useState<Introduction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Fetch posts and introductions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postsData, introsData] = await Promise.all([
          getPosts(),
          getIntroductions(),
        ]);
        setPosts(postsData);
        setIntroductions(introsData);
      } catch (err) {
        setError("Failed to load feed content");
        console.error("Feed loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitPost = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "posts") {
        const newPost = await createPost(
          newPostTitle,
          newPostContent,
          isJobPost ? "job" : "community"
        );
        setPosts((prev) => [newPost, ...prev]);
      } else {
        const newIntro = await createIntroduction(newPostContent);
        setIntroductions((prev) => [newIntro, ...prev]);
      }
      setNewPostContent("");
      setNewPostTitle("");
      setIsJobPost(false);
      setShowNewPostModal(false);
    } catch (err) {
      setError("Failed to create post");
      console.error("Post creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = showOnlyJobs
    ? posts.filter((post) => post.postType === "job")
    : posts;

  if (loading && !posts.length && !introductions.length) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        <p>Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-danger-100 text-danger rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "posts" ? "solid" : "ghost"}
          onPress={() => setActiveTab("posts")}
        >
          Posts
        </Button>
        <Button
          variant={activeTab === "intros" ? "solid" : "ghost"}
          onPress={() => setActiveTab("intros")}
        >
          Introductions
        </Button>
      </div>

      {/* Create Post Button */}
      <div className="mb-6 flex justify-between items-center">
        <Button
          color="primary"
          onPress={() => setShowNewPostModal(true)}
        >
          Create {activeTab === "intros" ? "Introduction" : "Post"}
        </Button>
        {activeTab === "posts" && (
          <div className="flex items-center gap-2">
            <Switch
              isSelected={showOnlyJobs}
              onValueChange={setShowOnlyJobs}
            />
            <span className="text-sm text-default-600">Show only jobs</span>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      <Modal isOpen={showNewPostModal} onClose={() => setShowNewPostModal(false)}>
        <ModalContent>
          <ModalHeader>
            Create {activeTab === "intros" ? "Introduction" : "Post"}
          </ModalHeader>
          <ModalBody>
            {activeTab === "posts" && (
              <>
                <Input
                  label="Title"
                  placeholder="Enter post title..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="mb-4"
                />
                <div className="flex items-center gap-2 mb-4">
                  <Switch
                    isSelected={isJobPost}
                    onValueChange={setIsJobPost}
                  />
                  <span className="text-sm">This is a job posting</span>
                </div>
              </>
            )}
            <Input
              label="Content"
              placeholder={
                activeTab === "intros"
                  ? "Introduce yourself anonymously..."
                  : "Share something with the community..."
              }
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="mb-4"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="ghost"
              onPress={() => setShowNewPostModal(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSubmitPost}
              isDisabled={!newPostContent.trim() || (activeTab === "posts" && !newPostTitle.trim())}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Feed Content */}
      <div className="space-y-4">
        {activeTab === "posts"
          ? filteredPosts.map((post) => (
              <div
                key={post.postID}
                className="p-4 rounded-lg border border-default-200 bg-content1"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  {post.postType === "job" && (
                    <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary">
                      #Job
                    </span>
                  )}
                </div>
                <p className="text-default-600 mb-2">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-default-400">
                  <span>Posted by {post.author.username}</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          : introductions.map((intro) => (
              <div
                key={intro.introID}
                className="p-4 rounded-lg border border-default-200 bg-content1"
              >
                <p className="text-default-600 mb-2">{intro.content}</p>
                <div className="text-sm text-default-400">
                  {new Date(intro.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};