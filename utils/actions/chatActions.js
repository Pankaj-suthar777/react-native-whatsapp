import { child, getDatabase, push, ref } from "firebase/database";
import { getFirebaseApp } from "../firbaseHelper";

export const createChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const app = getFirebaseApp();
  const dbref = ref(getDatabase(app));
  const newChat = await push(child(dbref, "chats"), newChatData);
  const chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbref, `userChats/${userId}`), newChat.key);
  }

  return newChat.key;
};
