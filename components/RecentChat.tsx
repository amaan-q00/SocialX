import { useAuthContext } from "@/context/AuthContext";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InlineLoader from "./InlineLoader";
import { UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";

interface User {
  username: string;
  profilePic?: string;
}

interface LastMessage {
  text: string;
  timestamp?: Timestamp;
}

interface ChatItem {
  uid: string;
  chatId: string;
  lastMessage: LastMessage;
  user: User;
}

export default function RecentChats() {
  const { userData } = useAuthContext();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


useEffect(() => {
  if (!userData?.uid) return;

  const unsubscribeFns: (() => void)[] = [];
  let hasSetLoading = false;

  const fetchLiveChats = async () => {
    try {
      const friendsRef = collection(db, "users", userData.uid, "friends");
      const friendsSnapshot = await getDocs(friendsRef);
      const friendUids = friendsSnapshot.docs.map((doc) => doc.id);

      friendUids.forEach(async (friendUid) => {
        const chatId = [userData.uid, friendUid].sort().join("_");

        const messagesQuery = query(
          collection(db, "chats", chatId, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const unsubscribe = onSnapshot(messagesQuery, async (messageSnap: QuerySnapshot<DocumentData>) => {
          const lastMessageDoc = messageSnap.docs[0];
          const lastMessageData = lastMessageDoc?.data() as LastMessage | undefined;

          const friendDocRef = doc(db, "users", friendUid);
          const friendDocSnap = await getDoc(friendDocRef);
          const friendUserData = friendDocSnap.exists()
            ? (friendDocSnap.data() as User)
            : null;

          if (friendUserData && lastMessageData?.text) {
            setChats((prevChats) => {
              const filtered = prevChats.filter((c) => c.uid !== friendUid);
              return [
                ...filtered,
                {
                  uid: friendUid,
                  chatId,
                  lastMessage: lastMessageData,
                  user: friendUserData,
                },
              ].sort(
                (a, b) =>
                  (b.lastMessage.timestamp?.seconds || 0) -
                  (a.lastMessage.timestamp?.seconds || 0)
              );
            });
          }

          // Only set loading to false on the first snapshot
          if (!hasSetLoading) {
            hasSetLoading = true;
            setLoading(false);
          }
        });

        unsubscribeFns.push(unsubscribe);
      });
    } catch (err) {
      console.error("Error loading real-time recent chats:", err);
      setLoading(false);
    }
  };

  fetchLiveChats();

  return () => {
    unsubscribeFns.forEach((unsub) => unsub());
  };
}, [userData?.uid]);



  if (loading) return <InlineLoader />;
  if (!chats.length)
    return (
      <div className="text-center text-zinc-500 py-10">
        You’ve got no chats yet. Go bother a friend.
      </div>
    );

  return (
    <div className="space-y-3">
      {chats.map(({ uid, user, lastMessage }) => (
        <div
          key={uid}
          onClick={() => router.push(`/chat/${uid}`)}
          className="flex items-center gap-3 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl cursor-pointer transition"
        >
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              className="h-12 w-12 rounded-full object-cover"
              alt={`${user.username}'s profile`}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-zinc-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user.username}</p>
            <p className="text-zinc-400 text-sm truncate">{lastMessage.text}</p>
          </div>
          <span className="text-xs text-zinc-500 shrink-0">
            {lastMessage.timestamp?.seconds
              ? formatDistanceToNow(
                  new Date(lastMessage.timestamp.seconds * 1000),
                  { addSuffix: true }
                )
              : "Now"}
          </span>
        </div>
      ))}
    </div>
  );
}
