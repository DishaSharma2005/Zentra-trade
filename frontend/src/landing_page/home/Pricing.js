import React from "react";

function Pricing() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section - Text */}
        <div className="col-md-5 mb-4 mb-md-0">
          <h2 className="mb-3 fw-semibold">Unbeatable Pricing</h2>
          <p className="mb-4">
            We pioneered the concept of discount broking and price transparency
            in India — flat fees, zero hidden charges, and complete clarity for
            every trader and investor.
          </p>
          <a
            href="#"
            className="text-decoration-none text-primary fw-medium"
          >
            See Pricing{" "}
            <i className="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
          </a>
        </div>

        {/* Spacer Column */}
        <div className="col-md-1"></div>

        {/* Right Section - Image */}
        <div className="col-md-6">
          <img
            src="media/images/priceSec.png"
            alt="Pricing Table Illustration"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
}

export default Pricing;
