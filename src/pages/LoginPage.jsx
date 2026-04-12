import Login from "../components/Login.jsx";

/**
 * Full-screen login route; wraps the form in the same app shell class as the editor.
 */
function LoginPage({ onLogin }) {
  return (
    <div className="app">
      <Login onLogin={onLogin} />
    </div>
  );
}

export default LoginPage;
