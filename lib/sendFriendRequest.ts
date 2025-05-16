import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export async function sendFriendRequest(fromUid: string, identifier: string) {
  const usersRef = collection(db, "users");

  const q = query(
    usersRef,
    where("email", "==", identifier)
  );
  const q2 = query(
    usersRef,
    where("username", "==", identifier)
  );

  let snap = await getDocs(q);
  if (snap.empty) snap = await getDocs(q2);
  if (snap.empty) throw new Error("User not found.");

  const toUser = snap.docs[0];
  const toUid = toUser.id;

  if (toUid === fromUid) throw new Error("You're already your own friend 😑");

  // Check if already sent
  const existing = await getDocs(
    query(
      collection(db, "friend_requests"),
      where("from", "==", fromUid),
      where("to", "==", toUid),
      where("status", "==", "pending")
    )
  );

  if (!existing.empty) throw new Error("Request already sent.");

  const toData = toUser.data();

  return await addDoc(collection(db, "friend_requests"), {
    from: fromUid,
    to: toUid,
    fromUsername: "", // optionally pull from profile
    toUsername: toData.username,
    status: "pending",
    timestamp: Timestamp.now(),
  });
}
