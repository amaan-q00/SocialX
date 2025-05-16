import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const cancelFriendRequest = async (requestId: string) => {
  await deleteDoc(doc(db, "friend_requests", requestId));
};
