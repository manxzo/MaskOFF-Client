import { useState, useEffect, useContext } from "react";
import usePosts from "@/hooks/usePosts";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Textarea, Switch } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { GlobalConfigContext } from "@/config/GlobalConfig";

const Dashboard = () => {
    const {
        posts,
        loading,
        error,
        fetchPosts,
        createNewPost,
        addPostComment,
        upvoteExistingPost,
        downvoteExistingPost,
    } = usePosts();
    const { user,refresh } = useContext(GlobalConfigContext);
    const [content, setContent] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
   
    useEffect(() => {
        fetchPosts();

        console.log(posts);
    }, [refresh])
    const convertDate = (timestamp) => {
        const dateObj = new Date(timestamp);

        const string = dateObj.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
        return string;
    }
    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tagArray = tags ? tags.split(",").map(tag => tag.trim()) : [];
            await createNewPost({ content, tags: tagArray, isAnonymous });
            setContent("");
            setTags("");
            setIsAnonymous(false);
        
        } catch (err) {
            console.error("Error creating post:", err);
        }
    };

    const handleCommentSubmit = async (postID: string) => {
        if (!commentContent[postID]) return;
        try {
            await addPostComment(postID, {
                content: commentContent[postID],
                isAnonymous: isAnonymous[postID],
            });
            setCommentContent((prev) => ({ ...prev, [postID]: "" }));
            
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };
    const handleUpvote = async (postID) => {
        try {
            await upvoteExistingPost(postID);
            
        }
        catch (err) {
            console.log(err);
        }
    }
    const handleDownvote = async (postID) => {
        try {
            await downvoteExistingPost(postID)
            
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <DefaultLayout>
            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Feed</h1>
                <Switch
                    isSelected={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                >
                    {isAnonymous ? "MaskON" : "MaskOFF"}
                </Switch>
                {/* new post form */}
                <Card className="mb-6">
                    <CardBody>
                        <form onSubmit={handlePostSubmit} className="space-y-3">
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                required
                                className="w-full"
                            />
                            <Input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Tags (comma separated)"
                            />
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Spinner size="sm" /> : "Post"}
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* posts list */}
                <div className="space-y-4">
                    {loading && posts.length === 0 ? (
                        <p>Loading posts...</p>
                    ) : posts.length > 0 ? (
                        posts.map((post: any) => (
                            <Card key={post.postID || post._id} className="border shadow">
                                <CardHeader>
                                    <h2 className="text-lg font-semibold">
                                        {post.isAnonymous
                                            ? post.user.anonymousIdentity
                                            : post.user.username}
                                    </h2>
                                    {post.isAnonymous && post.user.details && (
                                        <p className="text-sm text-gray-500">({post.user.details})</p>
                                    )}
                                </CardHeader>
                                <CardBody>
                                    <p>{post.content}</p>
                                    {post.tags && post.tags.length > 0 && (
                                        <p className="text-sm italic text-gray-500">
                                            Tags: {post.tags.join(", ")}
                                        </p>
                                    )}
                                </CardBody>
                                <CardFooter className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <Button
                                            color={post.upvotedBy.some((id) => id === user?.userID) ? "success" : "default"}
                                            variant="solid"
                                            onPress={() => handleUpvote(post.postID)}
                                        >
                                            👍 {post.upvotedBy.length}
                                        </Button>
                                        <Button
                                            color={post.downvotedBy.some((id) => id === user?.userID) ? "danger" : "default"}
                                            variant="solid"
                                            onPress={() => handleDownvote(post.postID)}
                                        >
                                            👎 {post.downvotedBy.length}
                                        </Button>
                                    </div>
                                    <div>
                                        <pre>{ convertDate(post.createdAt)
                                        }</pre>
                                    </div>
                                </CardFooter>

                                {/* Comments Section */}
                                <CardBody className="border-t mt-2">
                                    <h3 className="text-sm font-semibold">Comments</h3>
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map((comment: any) => (
                                            <div key={comment.commentID || comment._id} className="p-2 border-b">
                                                <strong>
                                                    {comment.author}
                                                </strong>
                                                <p>{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No comments yet.</p>
                                    )}

                                    {/* Add Comment Form */}
                                    <div className="mt-3">
                                        <Textarea
                                            value={commentContent[post.postID] || ""}
                                            onChange={(e) =>
                                                setCommentContent((prev) => ({
                                                    ...prev,
                                                    [post.postID]: e.target.value,
                                                }))
                                            }
                                            placeholder="Write a comment..."
                                            className="w-full"
                                        />
                                        <Button
                                            onPress={() => handleCommentSubmit(post.postID)}
                                            className="w-full mt-2"
                                        >
                                            Comment
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <p>No posts yet.</p>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Dashboard;
