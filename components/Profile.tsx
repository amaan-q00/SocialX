"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Pencil, UserIcon, LogOut, Trash2 } from "lucide-react";
import { signOut, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, userData, fetchOrCreateUserProfile } = useAuthContext();
  const router = useRouter();

  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleProfileUpdate = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let profilePicURL = userData?.profilePic || "";

      if (profilePicFile) {
        toast.loading("Uploading image...");
        profilePicURL = await uploadToCloudinary(profilePicFile);
        toast.dismiss();
        toast.success("Image uploaded!");
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username,
        bio,
        profilePic: profilePicURL,
      });

      toast.success("Profile updated!");
      fetchOrCreateUserProfile(user);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/login"); // Redirect to login page
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return toast.error("No user found.");

    try {
      await deleteUser(currentUser);
      toast.success("Account deleted. Peace out ✌️");
      router.push("/login"); // Redirect to login after account deletion
    } catch (err: any) {
      console.error(err);
      toast.error("Couldn't delete account. Try logging in again.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center p-6 max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold text-brand">Update Profile</h3>

      <div className="relative w-28 h-28 group">
        {profilePicFile || userData?.profilePic ? (
          <img
            src={
              profilePicFile
                ? URL.createObjectURL(profilePicFile)
                : userData?.profilePic
            }
            alt="Profile Pic"
            className="w-full h-full object-cover rounded-full border-2 border-zinc-700"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
            <UserIcon className="text-white/50" size={32} />
          </div>
        )}

        <div className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
          <Pencil size={18} />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          title="Change profile picture"
        />
      </div>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="bg-zinc-800 p-3 rounded w-full max-w-sm text-white placeholder-muted border-2 border-zinc-700 focus:ring-2 focus:ring-accent transition"
      />

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Write a short bio"
        className="bg-zinc-800 p-3 rounded w-full max-w-sm text-white placeholder-muted border-2 border-zinc-700 focus:ring-2 focus:ring-accent transition"
      />

      <button
        onClick={handleProfileUpdate}
        disabled={saving}
        className="bg-brand px-6 py-3 rounded text-white font-semibold hover:bg-accent transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 justify-center w-full max-w-sm px-6 py-3 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
      >
        <LogOut size={18} />
        Logout
      </button>

      {/* Delete Account Button */}
      <button
        onClick={() => setShowDeleteModal(true)}
        className="flex items-center gap-3 justify-center w-full max-w-sm px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        <Trash2 size={18} />
        Delete Account
      </button>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md border-2 border-zinc-700">
            <h4 className="text-white text-xl font-semibold mb-4">Delete Account?</h4>
            <p className="text-white/70 text-base mb-6">
              This action is permanent. All your data will be lost. Are you sure you want to delete your account?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
