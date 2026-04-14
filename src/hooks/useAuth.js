import { useState } from "react";
import { attemptLogin } from "../utils/userStorage.js";

/**
 * Manages authentication state: current user, login, and exposes
 * setCurrentUser so the parent can clear it on logout.
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username, password) => {
    const result = attemptLogin(username, password);
    if (result.ok) {
      setCurrentUser(username);
    } else {
      window.alert("Invalid username or password.");
    }
  };

  return { currentUser, setCurrentUser, handleLogin };
}
