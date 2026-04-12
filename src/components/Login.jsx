import { useState } from "react";

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (name.trim()) {
      onLogin(name.trim(), password);
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
          <input 
            type="text" 
            placeholder="Password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">
            Sign In (or create account) {/* Depend on whether the user has an existing account */}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;