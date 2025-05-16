import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function rejectFriendRequest(reqId: string) {
  const reqRef = doc(db, "friend_requests", reqId);
  await updateDoc(reqRef, { status: "rejected" });
}
