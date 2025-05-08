'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config"; // Assuming this is where Firebase auth is initialized
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Assuming this is where Firestore is initialized

interface UserProfile {
  uid: string;
  email: string;
  username: string;
  profilePic: string;
  createdAt: Date;
  [key: string]: any; // future-proofing
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  loadingProfile: boolean;
  fetchOrCreateUserProfile: (firebaseUser: User) => Promise<void>; // Expose function here
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: false,
  loadingProfile: false,
  fetchOrCreateUserProfile: async () => {}, // Provide a no-op function as default
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // To track the Firebase auth loading state
  const [loadingProfile, setLoadingProfile] = useState(true); // To track Firestore profile loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        await fetchOrCreateUserProfile(firebaseUser); // Fetch user profile from Firestore
      } else {
        setUserData(null); // If no user is logged in, reset the user data
      }
    });

    return () => unsubscribe(); // Clean up the subscription when the component unmounts
  }, []);

  const fetchOrCreateUserProfile = async (firebaseUser: User) => {
    try {
      setLoadingProfile(true);
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create user profile if it doesn't exist
        const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          username: firebaseUser.displayName || firebaseUser?.email?.split("@")[0] || "unknown",
          profilePic: firebaseUser.photoURL || "",
          createdAt: new Date(),
        };
        await setDoc(userRef, newUserProfile);
        setUserData(newUserProfile);
      } else {
        // If the profile exists, load it
        setUserData(userSnap.data() as UserProfile);
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setUserData(null); // Set user data to null if there's an error fetching it
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, loadingProfile, fetchOrCreateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  return useContext(AuthContext);
}
