import React from "react";

function Pricing() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section - Text */}
        <div className="col-12 col-md-5 mb-4 mb-md-0 text-center text-md-start">
          <h2 className="mb-3 fw-semibold fs-3 fs-md-2">Unbeatable Pricing</h2>
          <p className="mb-4 fs-6 fs-md-5">
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
        <div className="col-12 col-md-6 mt-4 mt-md-0 text-center">
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
