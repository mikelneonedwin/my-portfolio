"use client";

import { createSession, deleteSession } from "@/actions/auth";
import { HAS_SESSION_COOKIE } from "@/constants";
import { app, auth } from "@/lib/firebase";
import { getAnalytics } from "firebase/analytics";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import cookies from "js-cookie";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  user: User | null;
  state: AuthState;
  signIn: (provider: "google" | "github") => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export enum AuthState {
  Loading,
  Auth,
  NoAuth,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState(AuthState.Loading);

  const getIdToken = useCallback(() => {
    if (!user) throw new Error("No user logged in");
    return user.getIdToken();
  }, [user]);

  useEffect(() => {
    getAnalytics(app);
  }, []);

  // auto generate a session
  useEffect(() => {
    if (!user || cookies.get(HAS_SESSION_COOKIE)) return;
    getIdToken().then(createSession);
  }, [user, getIdToken]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setState(user ? AuthState.Auth : AuthState.NoAuth);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (provider: "google" | "github") => {
    try {
      const authProvider =
        provider === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();

      const result = await signInWithPopup(auth, authProvider);
      const idToken = await result.user.getIdToken();
      const error = await createSession(idToken);
      if (error) {
        setUser(null);
        throw error;
      }
      setUser(result.user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      await deleteSession();
      setUser(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    state,
    signIn,
    signOut: signOutUser,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
