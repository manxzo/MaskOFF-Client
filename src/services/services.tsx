import axios from "axios";
const network = import.meta.env.VITE_NETWORK_API_URL;
const SERVER_URL = `http://${network}/api/`;

// helper function to get token frm localStorage
export const getAuthToken = (): string | null => localStorage.getItem("token");

// create user (signup)
export const createUser = async (userInfo: {
  username: string;
  password: string;
}): Promise<any> => {
  const response = await axios.post(`${SERVER_URL}newuser`, userInfo);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// user login
export const login = async (
  username: string,
  password: string
): Promise<any> => {
  const response = await axios.post(`${SERVER_URL}users/login`, {
    username,
    password,
  });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// fetch user data if userID match token
export const fetchUserData = async (userID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}user/${userID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// user logout
export const logout = (): void => {
  localStorage.removeItem("token");
};

// get all users
export const retrieveAllUsers = async (): Promise<any> => {
  const response = await axios.get(`${SERVER_URL}users`);
  return response.data;
};

// send friend req (using friendID)
export const sendFriendReq = async (friendID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}friends/request`,
    { friendID },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// get friend requests for logged-in user
export const retrieveFriendReq = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}friends/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// accept friend request (using friendID)
export const acceptFriendReq = async (friendID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}friends/accept`,
    { friendID },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// get friend list for logged-in user
export const retrieveFriendList = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// start chat between logged-in users (using recipientID)
export const startChat = async (recipientID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}chat/create`,
    { recipientID },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// get all chats belonging to logged-in user
export const retrieveChats = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// get all messages in 1 chat (decrypted for participants)
export const retrieveChatMessages = async (chatId: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}chat/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// send message to recipient. this endpoint automatically check for an existing chat (or create one).
// it expect { recipientID, text } in body
export const sendMessage = async (
  recipientID: string,
  text: string
): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}chat/send`,
    { recipientID: recipientID, text: text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// edit a message in a chat
// expects { newText } in the body and uses the URL /chat/message/:chatId/:messageId
export const editMessage = async (
  chatId: string,
  messageId: string,
  newText: string
): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.put(
    `${SERVER_URL}chat/message/${chatId}/${messageId}`,
    { newText },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// delete specific message from chat
export const deleteMessage = async (
  chatId: string,
  messageId: string
): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.delete(
    `${SERVER_URL}chat/message/${chatId}/${messageId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// delete entire chat
export const deleteChat = async (chatId: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.delete(`${SERVER_URL}chat/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export interface Post {
  postID: string;
  title: string;
  content: string;
  author: {
    username: string;
    userID: string;
  } | null;
  postType: "community" | "job";
  createdAt: Date;
  // array of comments related with post
  comments: {
    author: {
      username: string;
      userID: string;
    } | null;
    content: string;
    createdAt: Date;
  }[];
}

export interface Introduction {
  introID: string;
  content: string;
  createdAt: Date;
}

// posts API calls
export const createPost = async (
  title: string,
  content: string,
  postType: "community" | "job"
) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token");

    const response = await axios.post(
      `${SERVER_URL}posts`,
      { title, content, postType },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create post error:", error);
    throw new Error(error.response?.data?.error || "Failed to create post");
  }
};

export const getPosts = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token");

    const response = await axios.get(`${SERVER_URL}posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get posts error:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch posts");
  }
};

// introductions API calls
export const createIntroduction = async (content: string) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token");

    const response = await axios.post(
      `${SERVER_URL}introduction`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create introduction error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to create introduction"
    );
  }
};

export const getIntroductions = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token");

    const response = await axios.get(`${SERVER_URL}introductions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get introductions error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch introductions"
    );
  }
};

export const createComment = async (postId: string, content: string) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token");

    const response = await axios.post(
      `${SERVER_URL}posts/${postId}/comments`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create comment error:", error);
    throw new Error(error.response?.data?.error || "Failed to create comment");
  }
};
