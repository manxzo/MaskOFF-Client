import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";  
import {
  createPost,
  getPosts,
  createIntroduction,
  getIntroductions,
  type Post,
  type Introduction,
} from "@/services/services";
import { PostInput } from "./PostInput";

export const Feed = () => {
  const [activeTab, setActiveTab] = useState<"intros" | "posts">("posts");
  const [showOnlyJobs, setShowOnlyJobs] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [introductions, setIntroductions] = useState<Introduction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (data: { title?: string; content: string; isJob?: boolean }) => {
    setError(null);
    try {
      if (activeTab === "posts") {
        const newPost = await createPost(
          data.title!,
          data.content,
          data.isJob ? "job" : "community"
        );
        setPosts((prev) => [newPost, ...prev]);
      } else {
        const newIntro = await createIntroduction(data.content);
        setIntroductions((prev) => [newIntro, ...prev]);
      }
    } catch (err) {
      setError("Failed to create post");
      throw err; // Re-throw to handle in the PostInput component
    }
  };

  const filteredPosts = showOnlyJobs
    ? posts.filter((post) => post.postType === "job")
    : posts;

  if (loading && !posts.length && !introductions.length) {
    return <div className="p-4 text-center">Loading feed...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-3 bg-danger-100 text-danger rounded">
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-4">
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

      <PostInput type={activeTab} onSubmit={handleSubmit} />

      {activeTab === "posts" && (
        <div className="flex items-center gap-2 mb-4">
          <Switch
            isSelected={showOnlyJobs}
            onValueChange={setShowOnlyJobs}
          />
          <span className="text-sm">Show only jobs</span>
        </div>
      )}

      <div className="space-y-4">
        {activeTab === "posts"
          ? filteredPosts.map((post) => (
              <Card key={post.postID} className="shadow-sm">
                <CardHeader className="flex justify-between">
                  <h3 className="font-bold text-xl">{post.title}</h3>
                  {post.postType === "job" && (
                    <Chip
                      color="primary"
                      variant="flat"
                      size="sm"
                    >
                      Job
                    </Chip>
                  )}
                </CardHeader>
                <CardBody>
                  <p>{post.content}</p>
                </CardBody>
                <CardFooter className="flex justify-between">
                  <span>By {post.author.username}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            ))
          : introductions.map((intro) => (
              <Card key={intro.introID} className="shadow-sm">
                <CardBody>
                  <p>{intro.content}</p>
                </CardBody>
                <CardFooter className="flex justify-end">
                  <span>{new Date(intro.createdAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};