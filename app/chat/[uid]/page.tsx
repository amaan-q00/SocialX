"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  User as UserIcon,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { removeFriend } from "@/lib/removeFriend";

const PAGE_SIZE = 10;

export default function ChatPage() {
  const { userData } = useAuthContext();
  const { uid: otherUid } = useParams();
  const router = useRouter();

  const currentUid = userData?.uid;
  const chatId = [currentUid, otherUid].sort().join("_");

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initial fetch
  useEffect(() => {
    if (!currentUid || !otherUid || initializedRef.current) return;

    initializedRef.current = true;
    const init = async () => {
      try {
        const q = query(
          collection(db, "chats", chatId, "messages"),
          orderBy("timestamp", "desc"),
          limit(PAGE_SIZE)
        );
        const snap = await getDocs(q);

        const fetchedMsgs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).reverse();

        setMessages(fetchedMsgs);
        setLastDoc(snap.docs[snap.docs.length - 1]);
        setHasMore(snap.docs.length === PAGE_SIZE);
      } catch (err) {
        toast.error("Failed to load messages.");
        console.error(err);
      } finally {
        setLoadingInitial(false);
        scrollToBottom();
      }
    };

    init();
    fetchOtherUser();
  }, [chatId, currentUid, otherUid]);

  // Real-time updates
  useEffect(() => {
    if (!currentUid || !otherUid) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const liveMsgs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(liveMsgs);
      scrollToBottom();
    });

    return () => unsub();
  }, [chatId]);

  // Load older messages on scroll top
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 100 && hasMore && !loadingMore) {
        loadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, lastDoc]);

  const loadMore = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);

    try {
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const olderMsgs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).reverse();

      setMessages((prev) => [...olderMsgs, ...prev]);
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      toast.error("Error loading messages.");
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setSending(true);
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: input.trim(),
        senderId: currentUid,
        timestamp: serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      toast.error("Failed to send message.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const fetchOtherUser = useCallback(async () => {
    try {
      const docRef = doc(db, "users", otherUid as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOtherUser({
          username: data.username || "User",
          bio: data.bio || "",
          profilePic: data.profilePic || null,
        });
      }
    } catch (err) {
      toast.error("Failed to load user info.");
      console.error(err);
    }
  }, [otherUid]);

  const removeFriendClick = async () => {
    setMenuOpen(false);
    try {
      const friendDocRef1 = doc(db, "friends", `${currentUid}_${otherUid}`);
      const friendDocRef2 = doc(db, "friends", `${otherUid}_${currentUid}`);

      await Promise.all([
        deleteDoc(friendDocRef1).catch(() => {}),
        deleteDoc(friendDocRef2).catch(() => {}),
      ]);

      const batch = writeBatch(db);
      const msgsRef = collection(db, "chats", chatId, "messages");
      const msgsSnap = await getDocs(msgsRef);
      msgsSnap.forEach((doc) => batch.delete(doc.ref));

      const chatDocRef = doc(db, "chats", chatId);
      batch.delete(chatDocRef);
      await batch.commit();

      await removeFriend(currentUid!, otherUid as string);
      toast.success("Friend removed and chat deleted.");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to remove friend.");
      console.error(err);
    }
  };

  const clearChat = async () => {
    setMenuOpen(false);
    try {
      const batch = writeBatch(db);
      const msgsRef = collection(db, "chats", chatId, "messages");
      const msgsSnap = await getDocs(msgsRef);
      msgsSnap.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      setMessages([]);
      setHasMore(false);
      setLastDoc(null);
      toast.success("Chat cleared.");
    } catch (err) {
      toast.error("Failed to clear chat.");
      console.error(err);
    }
  };

  if (!currentUid || !otherUid) return <p>Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="flex items-center p-4 border-b border-zinc-700">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft />
        </Link>
        <button onClick={() => setShowProfile(true)} className="flex items-center gap-3 flex-1 text-left">
          {otherUser?.profilePic ? (
            <img src={otherUser.profilePic} alt="Avatar" className="rounded-full h-[3rem] w-[3rem]" />
          ) : (
            <UserIcon className="w-9 h-9 text-zinc-400" />
          )}
          <div className="flex flex-col">
            <span className="font-semibold">{otherUser?.username}</span>
          </div>
        </button>
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)} className="p-2 hover:bg-zinc-700 rounded-full">
            <MoreVertical />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-zinc-800 rounded-md shadow-lg z-50">
              <button onClick={removeFriendClick} className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-500">
                Remove Friend
              </button>
              <button onClick={clearChat} className="w-full text-left px-4 py-2 hover:bg-zinc-600">
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2 space-y-reverse"
      >
        {loadingInitial && <div className="text-center text-zinc-500">Loading chat...</div>}
        {loadingMore && <div className="text-sm text-zinc-400 self-center">Loading more...</div>}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUid;
          return (
            <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "items-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl break-words ${
                  isMe ? "bg-brand text-white rounded-br-sm" : "bg-accent text-black rounded-bl-sm"
                }`}
              >
                {msg.text || <Loader2 className="animate-spin h-4 w-4" />}
              </div>
              <span className="text-xs text-zinc-400 mt-1">
                {msg.timestamp?.seconds
                  ? format(new Date(msg.timestamp.seconds * 1000), "p")
                  : "Sending..."}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-zinc-800 px-4 py-2 rounded-full text-white placeholder:text-zinc-500"
        />
        <button onClick={handleSend} disabled={sending}>
          {sending ? <Loader2 className="animate-spin w-5 h-5 text-brand" /> : <Send className="text-brand" />}
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-zinc-800 p-4 rounded-xl w-full max-w-md relative">
            {otherUser ? (
              <>
                {otherUser.profilePic ? (
                  <img src={otherUser.profilePic} alt="Avatar" className="mx-auto h-24 w-24 rounded-full" />
                ) : (
                  <UserIcon className="mx-auto w-20 h-20 text-zinc-400" />
                )}
                <h2 className="text-xl font-bold text-center mt-2">{otherUser.username}</h2>
                <p className="text-zinc-300 text-center mt-1">{otherUser.bio || "No bio yet."}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
            <button onClick={() => setShowProfile(false)} className="absolute top-3 right-3 p-1 hover:bg-zinc-700 rounded-full">
              <X className="w-6 h-6 text-zinc-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
