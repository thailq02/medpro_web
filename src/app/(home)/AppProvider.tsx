"use client";
import {User} from "@/apiRequest/ApiAuth";
import {PROFILE} from "@/apiRequest/common";
import socket from "@/lib/socket";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export default function AppProvider({children}: {children: React.ReactNode}) {
  const [user, setUserState] = useState<User | null>(() => null);
  useState(() => socket.connect());
  const setUser = useCallback(
    (user: User | null) => {
      setUserState(user);
      localStorage.setItem(PROFILE, JSON.stringify(user));
    },
    [setUserState]
  );

  useEffect(() => {
    const _user = localStorage.getItem(PROFILE);
    setUserState(_user ? JSON.parse(_user) : null);
  }, [setUserState]);

  return (
    <AppContext.Provider value={{user, setUser}}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
