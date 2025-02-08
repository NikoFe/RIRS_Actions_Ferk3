import React from "react";

export default function Login({ loginForm, setLoginForm, handleLogin }) {
  return (
    <>
      <div className="Login-div">
        <h1>Login</h1>
        <input
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) =>
            setLoginForm({ ...loginForm, username: e.target.value })
          }
        />
        <input
          placeholder="Password"
          type="password"
          value={loginForm.password}
          onChange={(e) =>
            setLoginForm({ ...loginForm, password: e.target.value })
          }
        />
        <button onClick={handleLogin} data-testid="login_button">
          Login
        </button>
      </div>
    </>
  );
}
