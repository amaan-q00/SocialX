import { doc, getDoc, writeBatch, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function acceptFriendRequest(reqId:string) {
  const reqRef = doc(db, "friend_requests", reqId);
  const reqSnap = await getDoc(reqRef);

  if (!reqSnap.exists()) throw new Error("Request not found");

  const req = reqSnap.data();
  if (req.status !== "pending") throw new Error("Request already handled");

  const { from: fromUid, to: toUid } = req;

  const batch = writeBatch(db);

  batch.update(reqRef, { status: "accepted" });

  batch.set(doc(db, `users/${fromUid}/friends/${toUid}`), {
    uid: toUid,
    addedAt: Timestamp.now(),
  });
  batch.set(doc(db, `users/${toUid}/friends/${fromUid}`), {
    uid: fromUid,
    addedAt: Timestamp.now(),
  });

  await batch.commit();
}
