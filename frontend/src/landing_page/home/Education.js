import React from "react";

function Education() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section - Image */}
        <div className="col-md-5 mb-4 mb-md-0">
          <img
            src="media/images/education.svg"
            alt="Stock Market Education Illustration"
            className="img-fluid"
          />
        </div>

        {/* Spacer Column */}
        <div className="col-md-1"></div>

        {/* Right Section - Text */}
        <div className="col-md-6">
          <h2 className="mb-4 fw-semibold">
            Free and Open Market Education
          </h2>

          <div className="mb-4">
            <p className="mb-2">
              <strong>Varsity</strong> — the largest online stock market
              education resource in the world, covering everything from
              the basics to advanced trading.
            </p>
            <a
              href="#"
              className="text-decoration-none text-primary fw-medium"
            >
              Learn on Varsity{" "}
              <i className="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
            </a>
          </div>

          <div>
            <p className="mb-2">
              <strong>TradingQ&A</strong> — the most active trading and
              investment community in India, where you can ask and answer
              market-related questions.
            </p>
            <a
              href="#"
              className="text-decoration-none text-primary fw-medium"
            >
              Visit TradingQ&A{" "}
              <i className="fa fa-long-arrow-right ms-2" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
