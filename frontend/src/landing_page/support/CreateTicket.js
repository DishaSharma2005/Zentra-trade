import React, { useState } from "react";

function CreateTicket() {
  const [openIndex, setOpenIndex] = useState(null);

  const data = [
    {
      title: "Account Opening",
      items: [
        "How to open an account?",
        "Documents required for account opening",
        "Account opening charges",
        "Track account opening status",
      ],
    },
    {
      title: "Your Zerodha Account",
      items: [
        "Login issues",
        "Change personal details",
        "Nominee details",
        "Account closure",
      ],
    },
    {
      title: "Kite",
      items: [
        "Placing orders",
        "Order types explained",
        "Charts and indicators",
        "Kite app troubleshooting",
      ],
    },
    {
      title: "Funds",
      items: [
        "Add money to your account",
        "Withdraw funds",
        "Fund settlement",
        "Ledger balance",
      ],
    },
    {
      title: "Console",
      items: [
        "Reports and statements",
        "Tax P&L",
        "Holdings and positions",
      ],
    },
    {
      title: "Coin",
      items: [
        "Mutual fund investments",
        "SIP setup",
        "Redeeming mutual funds",
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="support-container">

      {/* LEFT SECTION */}
      <div className="support-left">
        {data.map((section, index) => (
          <div key={index} className="support-card-wrapper">
            
            {/* HEADER */}
            <div
              className="support-card"
              onClick={() => toggleAccordion(index)}
            >
              <span>{section.title}</span>
              <span className="arrow">
                {openIndex === index ? "⌃" : "⌄"}
              </span>
            </div>

            {/* CONTENT */}
            {openIndex === index && (
              <div className="support-content">
                {section.items.map((item, i) => (
                  <p key={i} className="support-link">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT SECTION */}
      <div className="support-right">
        <div className="notice-box">
          <ul>
            <li>Evening session of MCX to remain closed on January 1, 2026</li>
            <li>Latest Intraday leverages and Square-off timings</li>
          </ul>
        </div>

        <div className="quick-links">
          <h4>Quick links</h4>
          <ol>
            <li>Track account opening</li>
            <li>Track segment activation</li>
            <li>Intraday margins</li>
            <li>Kite user manual</li>
            <li>Learn how to create a ticket</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
