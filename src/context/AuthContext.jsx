import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, appleProvider } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // True while we await a getRedirectResult() after mobile OAuth redirect
  const [redirectPending, setRedirectPending] = useState(false);
  const navigate = useNavigate();

  // On mount — check redirect result (for mobile compatibility)
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setRedirectPending(true);
    }
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          console.log("Redirect login result received successfully");
          const profile = await fetchOrCreateUserProfile(result.user);
          setUserProfile(profile);
          setUser(result.user);
          // Route immediately after redirect result — don't wait for App.jsx effect
          const isOnboardingDone = profile?.onboardingCompleted || profile?.onboardingComplete;
          navigate(isOnboardingDone ? '/chat' : '/onboarding', { replace: true });
        }
      })
      .catch((err) => {
        console.error("Firebase redirect login error: ", err);
        setAuthError(err.message);
      })
      .finally(() => {
        setRedirectPending(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("User authenticated:", firebaseUser);
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
        const data = snap.data();
        console.log("User profile fetched from Firestore:", data);
        
        // Sync to sessionStorage for AI context mapping
        sessionStorage.setItem('studentProfile', JSON.stringify({
          fullName: data.fullName || '',
          age: data.age || '',
          gender: data.gender || '',
          currentLevel: data.educationLevel || '',
          currentUniversity: data.university || data.institution || '',
          targetDegree: data.targetDegree || '',
          targetCourse: data.fieldOfStudy || '',
          dreamCountry: data.targetCountry || '',
          targetIntake: data.targetIntake || '',
          englishLevel: data.englishLevel || '',
          budgetRange: data.budgetRange || ''
        }));

        return data;
      } else {
        console.log("Creating new user profile doc in Firestore...");
        const newProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          fullName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          provider: firebaseUser.providerData[0]?.providerId || "unknown",
          createdAt: serverTimestamp(),
          onboardingCompleted: false,
          onboardingComplete: false,
          studyPlan: null,
        };
        await setDoc(ref, newProfile);
        return newProfile;
      }
    } catch (err) {
      console.error("Error fetching or creating user profile in Firestore:", err);
      // Fallback local profile in case of database connectivity issues during initialization
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        fullName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
        provider: firebaseUser.providerData[0]?.providerId || "unknown",
        onboardingCompleted: false,
        onboardingComplete: false,
        studyPlan: null
      };
    }
  }

  // Save onboarding details to Firestore
  async function saveOnboardingData(onboardingData) {
    if (!user) return;
    try {
      console.log("Saving onboarding data to Firestore for UID:", user.uid);
      const ref = doc(db, "users", user.uid);
      const dataToSave = {
        uid: user.uid,
        email: user.email || "",
        fullName: onboardingData.fullName || "",
        age: onboardingData.age || "",
        gender: onboardingData.gender || "",
        educationLevel: onboardingData.educationLevel || "",
        university: onboardingData.university || onboardingData.institution || "",
        institution: onboardingData.university || onboardingData.institution || "", // Compatibility
        fieldOfStudy: onboardingData.fieldOfStudy || "",
        semester: onboardingData.semester || "",
        cgpa: onboardingData.cgpa || "",
        targetCountry: onboardingData.targetCountry || "",
        targetDegree: onboardingData.targetDegree || "",
        targetIntake: onboardingData.targetIntake || "",
        englishLevel: onboardingData.englishLevel || "",
        budgetRange: onboardingData.budgetRange || "",
        careerGoal: onboardingData.careerGoal || "",
        studyLanguage: onboardingData.studyLanguage || "",
        workPreference: onboardingData.workPreference || "",
        onboardingCompleted: true,
        onboardingComplete: true, // Legacy compatibility
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(ref, dataToSave, { merge: true });
      
      // Sync to sessionStorage for AI context mapping
      sessionStorage.setItem('studentProfile', JSON.stringify({
        fullName: dataToSave.fullName,
        age: dataToSave.age,
        gender: dataToSave.gender,
        currentLevel: dataToSave.educationLevel,
        currentUniversity: dataToSave.university || dataToSave.institution,
        targetDegree: dataToSave.targetDegree,
        targetCourse: dataToSave.fieldOfStudy,
        dreamCountry: dataToSave.targetCountry,
        targetIntake: dataToSave.targetIntake,
        englishLevel: dataToSave.englishLevel,
        budgetRange: dataToSave.budgetRange,
        careerGoal: dataToSave.careerGoal,
        studyLanguage: dataToSave.studyLanguage,
        workPreference: dataToSave.workPreference
      }));

      setUserProfile(prev => ({ ...prev, ...dataToSave }));
      console.log("Onboarding data saved successfully:", dataToSave);
    } catch (err) {
      console.error("Error saving onboarding data to Firestore:", err);
      throw err;
    }
  }

  // Update user study plan after onboarding (Legacy compatibility)
  async function saveStudyPlan(plan) {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      const updateData = {
        studyPlan: plan,
        onboardingComplete: true,
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      };
      await setDoc(ref, updateData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updateData }));
    } catch (err) {
      console.error("Error saving study plan to Firestore:", err);
      throw err;
    }
  }

  // Google Sign In — popup on desktop, redirect on mobile
  async function signInWithGoogle() {
    console.log("Google Sign In started");
    setAuthError(null);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        console.log("Mobile context detected - using redirect authentication");
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.log("Desktop context detected - attempting popup authentication");
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log("Google Sign In success via popup, user authenticated:", result.user);
          return result;
        } catch (popupErr) {
          console.error("Popup authentication failed:", popupErr);
          
          // Detect specific popup blocker/environment issues to trigger redirect fallback
          if (
            popupErr.code === "auth/popup-blocked" ||
            popupErr.code === "auth/operation-not-supported-in-this-environment" ||
            popupErr.code === "auth/unauthorized-domain"
          ) {
            console.log("Popup blocked or not supported in environment. Falling back to redirect...");
            await signInWithRedirect(auth, googleProvider);
          } else {
            throw popupErr;
          }
        }
      }
    } catch (err) {
      console.error("Google Sign In failed:", err.code, err.message);
      let userFriendlyMessage = err.message;
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        userFriendlyMessage = "Sign-in popup was closed or cancelled before completion.";
      } else if (err.code === "auth/network-request-failed") {
        userFriendlyMessage = "Network request failed. Please check your internet connection and try again.";
      } else if (err.code === "auth/unauthorized-domain") {
        userFriendlyMessage = "This domain is not authorized for Firebase Authentication. Please check authorized domains in Firebase Console.";
      } else if (err.code === "auth/operation-not-supported-in-this-environment") {
        userFriendlyMessage = "This operation is not supported in the current environment (e.g. file:// or iframe).";
      }
      setAuthError(userFriendlyMessage);
      throw err;
    }
  }

  // Apple Sign In — popup on desktop, redirect on mobile
  async function signInWithApple() {
    setAuthError(null);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        console.log("Mobile detected — using redirect for Apple Sign In");
        await signInWithRedirect(auth, appleProvider);
        // Browser navigates away — getRedirectResult handles the rest on return
        return;
      }
      const result = await signInWithPopup(auth, appleProvider);
      return result;
    } catch (err) {
      // Fallback to redirect if popup is blocked
      if (
        err.code === "auth/popup-blocked" ||
        err.code === "auth/operation-not-supported-in-this-environment"
      ) {
        console.log("Apple popup blocked — falling back to redirect");
        await signInWithRedirect(auth, appleProvider);
        return;
      }
      setAuthError(err.message);
      throw err;
    }
  }

  // Sign Out
  async function logout() {
    await signOut(auth);
    sessionStorage.removeItem('studentProfile');
    setUserProfile(null);
    setUser(null);
  }

  // Sign in with email
  function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Register with email
  async function registerWithEmail(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    const profile = await fetchOrCreateUserProfile(userCredential.user);
    setUserProfile(profile);
    setUser(userCredential.user);
    return userCredential.user;
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      redirectPending,
      authError,
      authModalOpen,
      setAuthModalOpen,
      signInWithGoogle,
      signInWithApple,
      loginWithEmail,
      registerWithEmail,
      saveStudyPlan,
      saveOnboardingData,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
