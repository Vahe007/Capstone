"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { User } from "@/types";

type UserSessionContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  logout: () => void;
};

const UserSessionContext = createContext<UserSessionContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/getUserData");
        const data = await res.json();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    Cookies.remove("accessToken");
    setUser(null);
  };

  return (
    <UserSessionContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => useContext(UserSessionContext);
