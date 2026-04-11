import { useState } from "react";
import "./Login.css"; // ניצור לו גם עיצוב משלו

function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // מונע מהדף להתרענן בלחיצה על Enter
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Virtual Editor</h1>
        <p>Please enter your username to continue</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username..." 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            autoFocus
          />
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;