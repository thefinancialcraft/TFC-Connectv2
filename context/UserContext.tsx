import { createContext, useContext } from "react";
import { UserProfile } from "../lib/authService";

export interface UserContextType {
  user: UserProfile | null;
  mounted: boolean;
  loading: boolean;
  error: string | null;
  statusMessage?: string;
  sessionExpired: boolean;
  refetchUser: (force?: boolean) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  mounted: false,
  loading: true,
  error: null,
  statusMessage: "",
  sessionExpired: false,
  refetchUser: async () => {},
});

export const useUser = () => useContext(UserContext);
