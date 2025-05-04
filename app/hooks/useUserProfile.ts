// hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

export function useUserProfile(uid?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = onSnapshot(doc(db, "users", uid), (docSnap) => {
      setProfile(docSnap.data());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { profile, loading };
}
