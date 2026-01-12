import React from "react";

function Hero() {
  return (
    <div className="support-hero">
      <div className="hero-header">
        <h1>Support Portal</h1>
        <button className="my-ticket-btn">My tickets</button>
      </div>

      <input
        type="text"
        placeholder="Eg: How do I open my account, How do I activate F&O..."
        className="support-search"
      />
    </div>
  );
}

export default Hero;
