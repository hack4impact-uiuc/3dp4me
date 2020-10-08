import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react";
// import "./Login.css";

const Login = function() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await Auth.signIn(email, password);
      alert("Logged in");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
          <p>Email</p>
          <input
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <p>Password</p>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          /><br />

        <input type="submit" disabled={!validateForm()} value="submit" />
      </form>
    </div>
  );
}

export default Login;