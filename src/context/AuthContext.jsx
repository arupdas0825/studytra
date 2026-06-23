import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, appleProvider } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // On mount — check redirect result (for mobile compatibility)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const profile = await fetchOrCreateUserProfile(result.user);
          setUserProfile(profile);
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.error("Firebase redirect login error: ", err);
        setAuthError(err.message);
      });
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await fetchOrCreateUserProfile(firebaseUser);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error setting user profile: ", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Fetch or create Firestore user doc
  async function fetchOrCreateUserProfile(firebaseUser) {
    try {
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data();
      } else {
        const newProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          provider: firebaseUser.providerData[0]?.providerId || "unknown",
          createdAt: new Date().toISOString(), // fallback to ISO string if needed, but Firestore supports native Date objects or ServerTimestamp
          onboardingComplete: false,
          studyPlan: null,
        };
        // Use setDoc to create the new profile
        await setDoc(ref, newProfile);
        return newProfile;
      }
    } catch (err) {
      console.error("Error fetching or creating user profile in Firestore:", err);
      // Fallback local profile in case of database connectivity issues during initialization
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        provider: firebaseUser.providerData[0]?.providerId || "unknown",
        onboardingComplete: false,
        studyPlan: null
      };
    }
  }

  // Update user study plan after onboarding
  async function saveStudyPlan(plan) {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        studyPlan: plan,
        onboardingComplete: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setUserProfile(prev => ({ ...prev, studyPlan: plan, onboardingComplete: true }));
    } catch (err) {
      console.error("Error saving study plan to Firestore:", err);
      throw err;
    }
  }

  // Google Sign In — popup on desktop, redirect on mobile
  async function signInWithGoogle() {
    setAuthError(null);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }

  // Apple Sign In
  async function signInWithApple() {
    setAuthError(null);
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }

  // Sign Out
  async function logout() {
    await signOut(auth);
    setUserProfile(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      authError,
      signInWithGoogle,
      signInWithApple,
      saveStudyPlan,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
