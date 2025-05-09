"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config"; // Assuming this is where Firebase auth is initialized
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Assuming this is where Firestore is initialized

interface UserProfile {
  uid: string;
  email: string;
  username: string;
  bio: string;
  profilePic: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  loadingProfile: boolean;
  error: string | null;
  fetchOrCreateUserProfile: (firebaseUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: false,
  loadingProfile: false,
  error: null,
  fetchOrCreateUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setUser(firebaseUser);
        await fetchOrCreateUserProfile(firebaseUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchOrCreateUserProfile = useCallback(async (firebaseUser: User) => {
    try {
      setLoadingProfile(true);
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          username:
            firebaseUser.displayName ||
            firebaseUser?.email?.split("@")[0] ||
            "unknown",
          profilePic: firebaseUser.photoURL || "",
          createdAt: new Date(),
          bio: "",
        };
        await setDoc(userRef, newUserProfile);
        setUserData(newUserProfile);
      } else {
        setUserData(userSnap.data() as UserProfile);
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setUserData(null);
      setError("Failed to load your profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        loadingProfile,
        error,
        fetchOrCreateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  return useContext(AuthContext);
}
