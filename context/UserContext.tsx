import { createContext, useContext } from "react";
import { UserProfile } from "../lib/authService";

export interface UserContextType {
  user: UserProfile | null;
  mounted: boolean;
  loading: boolean;
  error: string | null;
  statusMessage?: string;
  refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  mounted: false,
  loading: true,
  error: null,
  statusMessage: "",
  refetchUser: async () => {},
});

export const useUser = () => useContext(UserContext);
