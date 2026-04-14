import { useState } from "react";
import userStorage from "../utils/userStorage.js";
const { attemptLogin } = userStorage;

/**
 * Manages authentication state: current user, login, and exposes
 * setCurrentUser so the parent can clear it on logout.
 */
export default function useAuth() {
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
