import { retrieveChats ,retrieveChatMessages} from "@/services/services";

// A helper function to fetch chats and process their messages.
// If `mapParticipants` is true, it also maps participants.
export const fetchAndProcessChats = async (mapParticipants: boolean = false) => {
    const chatsRaw = await retrieveChats();
    const chats = await Promise.all(
      (chatsRaw || []).map(async (chat: any) => {
        const messages = await retrieveChatMessages(chat.chatID);
        const mappedMessages = (messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        if (mapParticipants) {
          const mappedParticipants = chat.participants.map((participant: any) => ({
            userID: participant.userID,
            username: participant.username,
          }));
          return {
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: mappedMessages,
            participants: mappedParticipants,
          };
        }
        return {
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: mappedMessages,
        };
      })
    );
    return chats;
  };
  