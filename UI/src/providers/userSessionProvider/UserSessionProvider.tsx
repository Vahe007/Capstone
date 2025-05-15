"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  medicalData?: string[];
  hasHeartDisease?: number;
  isVerified?: boolean;
};

type UserSessionContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
};

const UserSessionContext = createContext<UserSessionContextType>({
  user: null,
  loading: true,
  setUser: () => {},
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

  return (
    <UserSessionContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => useContext(UserSessionContext);
