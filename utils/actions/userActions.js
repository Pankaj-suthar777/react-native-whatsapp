import {
  child,
  endAt,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  remove,
  startAt,
} from "firebase/database";
import { getFirebaseApp } from "../firbaseHelper";

export const getUserData = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const searchUser = async (quaryText) => {
  const serachTerm = quaryText.toLowerCase();

  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, "users");

    const queryRef = query(
      userRef,
      orderByChild("firstLast"),
      startAt(serachTerm),
      endAt(serachTerm + "\uf8ff")
    );
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserChats = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `userChats/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserChat = async (userId, key) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}/${key}`);
    await remove(chatRef);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUserChat = async (userId, chatId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}`);
    await push(chatRef, chatId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
