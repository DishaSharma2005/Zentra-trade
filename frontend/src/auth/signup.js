// landing_page/signup/SignUp.js
import React from "react";
import { supabase } from "../supabaseClient";
import {Link } from "react-router-dom";

function Signup() {
  const handleEmailSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! You can login now.");
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {/* Left Image Section */}
      <div style={{ flex: 1, paddingRight: "2rem" }}>
        <img
          src="/media/images/signup.png"
          alt="Signup Visual"
          style={{ width: "80%", borderRadius: "12px", objectFit: "cover" }}
        />

      </div>

      {/* Right Signup Form */}
      <div style={{ flex: 1, maxWidth: "400px" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Signup Now</h2>

        <form onSubmit={handleEmailSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            style={{ padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
          />
          <button
            type="submit"
            style={{
              padding: "0.8rem",
              backgroundColor: "#0066ff",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Signup
          </button>
        </form>

        <hr style={{ margin: "2rem 0" }} />

        <button
          onClick={handleGoogleSignup}
          style={{
            padding: "0.8rem",
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem",
          }}
        >
          <img
            src="/media/images/Google.png"
            alt="Google"
            style={{ width: "40px", height: "40px" }}
          />
          Continue with Google
        </button>
                    <p
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
                fontSize: "0.95rem",
                color: "#555",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#0066ff",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Login
              </Link>
            </p>

      </div>
    </div>
  );
}

export default Signup;
