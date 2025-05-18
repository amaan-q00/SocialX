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

    const fetchRecentChats = async () => {
      try {
        const friendsRef = collection(db, "users", userData.uid, "friends");
        const friendsSnapshot = await getDocs(friendsRef);

        const friendUids = friendsSnapshot.docs.map((doc) => doc.id);

        const chatPromises = friendUids.map(async (friendUid) => {
          const chatId = [userData.uid, friendUid].sort().join("_");

          const messagesQuery = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "desc"),
            limit(1)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          const lastMessageDoc = messagesSnapshot.docs[0];
          const lastMessageData = lastMessageDoc?.data() as LastMessage | undefined;

          const friendDocRef = doc(db, "users", friendUid);
          const friendDocSnap = await getDoc(friendDocRef);
          const friendUserData = friendDocSnap.exists()
            ? (friendDocSnap.data() as User)
            : null;

          return {
            uid: friendUid,
            chatId,
            lastMessage: lastMessageData || { text: "", timestamp: undefined },
            user: friendUserData || { username: "Unknown" },
          };
        });

        const results = await Promise.all(chatPromises);

        const filteredResults = results.filter(
          (chat) => chat.user && chat.lastMessage.text
        );

        setChats(
          filteredResults.sort(
            (a, b) =>
              (b.lastMessage.timestamp?.seconds || 0) -
              (a.lastMessage.timestamp?.seconds || 0)
          )
        );
      } catch (error) {
        console.error("Error loading recent chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentChats();
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
