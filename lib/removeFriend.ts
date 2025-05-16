import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function removeFriend(myUid: string, friendUid: string) {
  // Delete each other from friends subcollections
  await Promise.all([
    deleteDoc(doc(db, `users/${myUid}/friends/${friendUid}`)),
    deleteDoc(doc(db, `users/${friendUid}/friends/${myUid}`)),
  ]);
}
