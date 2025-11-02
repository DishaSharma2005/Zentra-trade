import React from "react";

function Awards() {
  return (
    <div className="container py-5 my-5">
      <div className="row align-items-center">
        {/* Left Section - Image */}
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src="media/images/largestBroker.svg"
            alt="Largest Stock Broker Illustration"
            className="img-fluid"
          />
        </div>

        {/* Right Section - Text and Details */}
        <div className="col-md-6">
          <h2 className="fw-semibold mb-3">Largest Stock Broker in India</h2>
          <p className="mb-4 text-muted">
            Over <strong>2 million Zerodha clients</strong> contribute to more
            than <strong>15%</strong> of all retail order volumes in India daily
            — trading and investing across multiple asset classes:
          </p>

          <div className="row mb-4">
            <div className="col-6">
              <ul className="list-unstyled">
                <li>Equities</li>
                <li>Derivatives</li>
                <li>Commodities</li>
              </ul>
            </div>
            <div className="col-6">
              <ul className="list-unstyled">
                <li>Mutual Funds</li>
                <li>Bonds</li>
                <li>ETFs</li>
              </ul>
            </div>
          </div>

          <img
            src="media/images/pressLogos.png"
            alt="Press Mentions Logos"
            className="img-fluid mt-3"
            style={{ maxWidth: "600px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Awards;
