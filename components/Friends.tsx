"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Users,
  Check,
  X,
  Trash2,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { sendFriendRequest } from "@/lib/sendFriendRequest";
import { removeFriend } from "@/lib/removeFriend";
import { acceptFriendRequest } from "@/lib/acceptFriendRequest";
import { rejectFriendRequest } from "@/lib/rejectFriendRequest";
import { cancelFriendRequest } from "@/lib/cancelFriendRequest";
import { toast } from "react-hot-toast";

export default function FriendsTab() {
  const { userData } = useAuthContext();
  const uid = userData?.uid;

  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    // Friends
    const unsubFriends = onSnapshot(
      collection(db, `users/${uid}/friends`),
      async (snap) => {
        const data = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const friendDoc = await getDoc(doc(db, "users", docSnap.id));
            const friendInfo = friendDoc.exists() ? friendDoc.data() : {};
            return {
              id: docSnap.id,
              ...data,
              ...friendInfo,
            };
          })
        );
        setFriends(data);
      }
    );

    const unsubIncoming = onSnapshot(
      query(
        collection(db, "friend_requests"),
        where("to", "==", uid),
        where("status", "==", "pending")
      ),
      async (snap) => {
        const incomingWithUserData = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const req = docSnap.data();
            const fromUid = req.from;
            const userDoc = await getDoc(doc(db, "users", fromUid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            return {
              id: docSnap.id,
              ...req,
              direction: "incoming",
              username: userData.username || "No Name",
              email: userData.email || "No Email",
              profilePic: userData.profilePic || null,
              uid: fromUid,
            };
          })
        );
        setRequests((prev) => [
          ...prev.filter((r) => r.direction !== "incoming"),
          ...incomingWithUserData,
        ]);
      }
    );

    // Outgoing requests (requests where 'from' === uid)
    const unsubOutgoing = onSnapshot(
      query(
        collection(db, "friend_requests"),
        where("from", "==", uid),
        where("status", "==", "pending")
      ),
      async (snap) => {
        const outgoingWithUserData = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const req = docSnap.data();
            const toUid = req.to;
            const userDoc = await getDoc(doc(db, "users", toUid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            return {
              id: docSnap.id,
              ...req,
              direction: "outgoing",
              username: userData.username || "No Name",
              email: userData.email || "No Email",
              profilePic: userData.profilePic || null,
              uid: toUid,
            };
          })
        );
        setRequests((prev) => [
          ...prev.filter((r) => r.direction !== "outgoing"),
          ...outgoingWithUserData,
        ]);
      }
    );

    return () => {
      unsubFriends();
      unsubIncoming();
      unsubOutgoing();
    };
  }, [uid]);

  const handleSendRequest = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      await sendFriendRequest(uid!, input.trim());
      toast.success("Friend request sent!");
      setInput("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleRemoveFriend = async (friendUid: string) => {
    try {
      await removeFriend(uid!, friendUid);
      toast.success("Friend removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove friend");
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Friend request accepted");
    } catch (err: any) {
      toast.error(err.message || "Failed to accept request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      toast("Request rejected", { icon: "🚫" });
    } catch (err: any) {
      toast.error(err.message || "Failed to reject request");
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      await cancelFriendRequest(requestId);
      toast("Request cancelled", { icon: "❌" });
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel request");
    }
  };

  const renderUserCard = (
    user: any,
    actions: React.ReactNode,
    label?: string
  ) => (
    <div
      key={user.uid || user.id}
      className="flex justify-between items-center bg-zinc-800 p-3 rounded-xl hover:bg-zinc-700 transition"
    >
      <div className="flex items-center gap-3">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <Users size={28} className="text-brand" />
        )}
        <div>
          <p className="font-medium text-white">{user.username || user.uid}</p>
          <p className="text-sm text-zinc-400">{user.email || "No email"}</p>
          {label && <p className="text-xs text-zinc-500">{label}</p>}
        </div>
      </div>
      {actions}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="inline-flex rounded-lg bg-zinc-800 p-1 w-fit self-center mb-2">
        {[
          ["friends", <Users size={16} />, "Friends"],
          ["requests", <UserPlus size={16} />, "Requests"],
        ].map(([key, icon, label]) => (
          <button
            key={key as string}
            className={`px-4 py-2 rounded-md flex items-center gap-1 text-sm ${
              activeTab === key
                ? "bg-brand text-white"
                : "text-zinc-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(key as "friends" | "requests")}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Add Friend Form */}
      {activeTab === "requests" && (
        <div className="flex gap-2 items-center">
          <div className="relative w-full">
            <Clock
              className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Email or Username"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-2 pl-8 pr-3 text-white placeholder:text-zinc-500"
            />
          </div>
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="bg-brand text-white px-4 py-2 rounded-md"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Add"}
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="grid gap-2">
        {activeTab === "friends" &&
          (friends.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              You have no friends yet 😐
            </p>
          ) : (
            friends.map((f) =>
              renderUserCard(
                f,
                <button
                  onClick={() => handleRemoveFriend(f.uid)}
                  className="text-red-500 hover:text-red-400"
                  title="Remove Friend"
                >
                  <Trash2 size={18} />
                </button>
              )
            )
          ))}

        {activeTab === "requests" &&
          (requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No pending requests.
            </p>
          ) : (
            requests.map((r) =>
              renderUserCard(
                r,
                r.direction === "incoming" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(r.id)}
                      className="text-green-500 hover:text-green-400"
                      title="Accept"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="text-yellow-500 hover:text-yellow-400"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCancel(r.id)}
                    className="text-yellow-500 hover:text-yellow-400"
                    title="Cancel Request"
                  >
                    <X size={18} />
                  </button>
                ),
                r.direction === "incoming" ? "Incoming Request" : "Sent Request"
              )
            )
          ))}
      </div>
    </div>
  );
}
