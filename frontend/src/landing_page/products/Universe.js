import React from "react";

function Universe() {
  const logoBoxStyle = {
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
  };

  const logoStyle = {
    maxHeight: "100%",
    maxWidth: "180px",
    objectFit: "contain",
  };

  return (
    <div className="container text-center my-5">

      {/* Heading */}
      <p className="text-muted">
        Extend your trading and investment experience even further with our partner platforms
      </p>

      {/* FIRST ROW */}
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div style={logoBoxStyle}>
            <img
              src="media/images/zerodhaFundhouse.png"
              alt="Zerodha Fund House"
              style={logoStyle}
            />
          </div>
          <h5>Zerodha Fund House</h5>
          <p className="text-muted">
            Our asset management venture that is creating simple and transparent index funds to help you save for your goals.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <div style={logoBoxStyle}>
            <img
              src="media/images/sensibullLogo.svg"
              alt="Sensibull"
              style={logoStyle}
            />
          </div>
          <h5>Sensibull</h5>
          <p className="text-muted">
            Options trading platform that lets you create strategies, analyze positions, and examine data points like open interest, FII/DII, and more.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <div style={logoBoxStyle}>
            <img
              src="media/images/goldenpiLogo.png"
              alt="GoldenPi"
              style={logoStyle}
            />
          </div>
          <h5>GoldenPi</h5>
          <p className="text-muted">
            Investment research platform that offers detailed insights on stocks, sectors, supply chains, and more.
          </p>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <div style={logoBoxStyle}>
            <img
              src="media/images/streakLogo.png"
              alt="Streak"
              style={logoStyle}
            />
          </div>
          <h5>Streak</h5>
          <p className="text-muted">
            Systematic trading platform that allows you to create and backtest strategies without coding.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <div style={logoBoxStyle}>
            <img
              src="media/images/smallcaseLogo.png"
              alt="Smallcase"
              style={logoStyle}
            />
          </div>
          <h5>Smallcase</h5>
          <p className="text-muted">
            Thematic investing platform that helps you invest in diversified baskets of stocks on ETFs.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <div style={logoBoxStyle}>
            <img
              src="media/images/dittoLogo.png"
              alt="Ditto"
              style={logoStyle}
            />
          </div>
          <h5>Ditto</h5>
          <p className="text-muted">
            Personalized advice on life and health insurance. No spam and no mis-selling.
          </p>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="mt-5">
        <button className="btn btn-primary px-4 py-2">
          Sign up for free
        </button>
      </div>

    </div>
  );
}

export default Universe;
