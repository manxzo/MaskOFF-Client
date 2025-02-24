import { useState } from "react";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  addComment,
  upvotePost,
  downvotePost,
} from "@/services/services";


const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPosts();
      const sortedPosts = res.data.posts.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error fetching posts"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNewPost = async (data: {
    content: string;
    tags?: string[];
    isAnonymous?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPost(data);
      const newPost = res.data.post || res.data;
      setPosts((prev) => [newPost, ...prev]);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error creating post"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingPost = async (
    postID: string,
    data: { content?: string; tags?: string[]; isAnonymous?: boolean }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updatePost(postID, data);
      const updatedPost = res.data.post || res.data;
      setPosts((prev) =>
        prev.map((post) => (post.postID === postID ? updatedPost : post))
      );
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error updating post"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingPost = async (postID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deletePost(postID);
      setPosts((prev) => prev.filter((post) => post.postID !== postID));
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error deleting post"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // !updated addPostComment: accepts an object with content and an optional isAnonymous flag.
  const addPostComment = async (
    postID: string,
    data: { content: string; isAnonymous?: boolean }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addComment(postID, data);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Error adding comment"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const upvoteExistingPost = async (postID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await upvotePost(postID);
      // option to update local state if needed.
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error upvoting post"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downvoteExistingPost = async (postID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await downvotePost(postID);
      // option to update local state if needed.
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Error downvoting post"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createNewPost,
    updateExistingPost,
    deleteExistingPost,
    addPostComment,
    upvoteExistingPost,
    downvoteExistingPost,
    setPosts,
    setError,
    setLoading,
  };
};

export default usePosts;
