import axios from "axios";

const SERVER_URL = "https://dkktf4-3000.csb.app/api/";

// Helper function to get token from localStorage
export const getAuthToken = (): string | null => localStorage.getItem("token");

// Create User (Signup)
export const createUser = async (userInfo: { username: string; password: string }): Promise<any> => {
  const response = await axios.post(`${SERVER_URL}newuser`, userInfo);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Login User
export const login = async (username: string, password: string): Promise<any> => {
  const response = await axios.post(`${SERVER_URL}users/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Fetch User Data if userID matches token
export const fetchUserData = async (userID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}user/${userID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Logout User
export const logout = (): void => {
  localStorage.removeItem("token");
};

// Retrieve all users
export const retrieveAllUsers = async (): Promise<any> => {
  const response = await axios.get(`${SERVER_URL}users`);
  return response.data;
};

// Send a Friend Request (uses friendID)
export const sendFriendReq = async (friendID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}friends/request`,
    { friendID },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Retrieve Friend Requests for logged-in user
export const retrieveFriendReq = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}friends/requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Accept Friend Request (uses friendID)
export const acceptFriendReq = async (friendID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}friends/accept`,
    { friendID },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Retrieve Friend List for logged-in user
export const retrieveFriendList = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Start Chat between Logged-in User and another participant (uses recipientID)
export const startChat = async (recipientID: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}chat/create`,
    { recipientID },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Retrieve all Chats belonging to the logged-in user
export const retrieveChats = async (): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Retrieve all messages in a Chat (decrypted for participants)
export const retrieveChatMessages = async (chatId: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}chat/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Send a message to a recipient. This endpoint automatically checks for an existing chat (or creates one).
// It expects { recipientID, text } in the body.
export const sendMessage = async (recipientID: string, text: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${SERVER_URL}chat/send`,
    { recipientID:recipientID, text:text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Edit a message in a chat.
// Expects { newText } in the body and uses the URL /chat/message/:chatId/:messageId
export const editMessage = async (chatId: string, messageId: string, newText: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.put(
    `${SERVER_URL}chat/message/${chatId}/${messageId}`,
    { newText },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete a specific message from a chat
export const deleteMessage = async (chatId: string, messageId: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.delete(`${SERVER_URL}chat/message/${chatId}/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete an entire chat
export const deleteChat = async (chatId: string): Promise<any> => {
  const token = getAuthToken();
  const response = await axios.delete(`${SERVER_URL}chat/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
