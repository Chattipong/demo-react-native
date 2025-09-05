import {
  getCurrentUser,
  isEmailVerified,
  showLogoutConfirmation,
} from "@/lib/services/authService";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const handleQuickLogout = () => {
    showLogoutConfirmation();
  };

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  return {
    user,
    isLoading,
    isEmailVerified: isEmailVerified(),
    handleQuickLogout,
    refreshUser,
  };
};
