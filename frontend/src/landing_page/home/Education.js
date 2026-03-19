import React from "react";
import { Link } from "react-router-dom";  
function Education() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section - Image */}
        <div className="col-12 col-md-5 mb-4 mb-md-0 text-center">
          <img
            src="media/images/education.svg"
            alt="Stock Market Education Illustration"
            className="img-fluid"
          />
        </div>

        {/* Spacer Column */}
        <div className="d-none d-md-block col-md-1"></div>

        {/* Right Section - Text */}
        <div className="col-12 col-md-6 text-center text-md-start">
          <h2 className="mb-4 fw-semibold">
            Free and Open Market Education
          </h2>

          <div className="mb-4">
            <p className="mb-2">
              <strong>Varsity</strong> — the largest online stock market
              education resource in the world, covering everything from
              the basics to advanced trading.
            </p>
            <Link 
              to="/product"
              className="text-decoration-none text-primary fw-medium"
            >
              Learn on Varsity{" "}
              <i className="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
            </Link>
          </div>

          <div>
            <p className="mb-2">
              <strong>TradingQ&A</strong> — the most active trading and
              investment community in India, where you can ask and answer
              market-related questions.
            </p>
            <Link
              to="/product"
              className="text-decoration-none text-primary fw-medium"
            >
              Visit TradingQ&A{" "}
              <i className="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
