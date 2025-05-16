import { doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function acceptFriendRequest(reqId: string) {
  const reqRef = doc(db, "friend_requests", reqId);
  const reqSnap = await getDoc(reqRef);

  if (!reqSnap.exists()) throw new Error("Request not found");

  const req = reqSnap.data();
  if (req.status !== "pending") throw new Error("Request already handled");

  const fromUid = req.from;
  const toUid = req.to;

  // Accept the request
  await updateDoc(reqRef, { status: "accepted" });

  // Add each other as friends
  await Promise.all([
    setDoc(doc(db, `users/${fromUid}/friends/${toUid}`), {
      uid: toUid,
      addedAt: Timestamp.now(),
    }),
    setDoc(doc(db, `users/${toUid}/friends/${fromUid}`), {
      uid: fromUid,
      addedAt: Timestamp.now(),
    }),
  ]);
}
