import { createContext, useContext } from "react";
import { UserProfile } from "../lib/authService";

export interface UserContextType {
  user: UserProfile | null;
  mounted: boolean;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  mounted: false,
  loading: false,
  error: null,
  refetchUser: async () => {},
});

export const useUser = () => useContext(UserContext);
