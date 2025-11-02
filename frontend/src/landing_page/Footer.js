import React from 'react';

function Footer() {
  return (
    <footer className="bg-light text-dark mt-5 pt-5 border-top">
      <div className="container">
        <div className="row">
          {/* Left copyright */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">© 2010 - 2025, Zerodha Broking Ltd.</h6>
            <p className="small mb-2">All rights reserved.</p>
          </div>

          {/* Account */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Account</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none text-dark">Open demat account</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Minor demat account</a></li>
              <li><a href="#" className="text-decoration-none text-dark">NRI demat account</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Commodity</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Dematerialisation</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Fund transfer</a></li>
              <li><a href="#" className="text-decoration-none text-dark">MTF</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Referral program</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none text-dark">Contact us</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Support portal</a></li>
              <li><a href="#" className="text-decoration-none text-dark">How to file a complaint?</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Status of your complaints</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Bulletin</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Circular</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Z-Connect blog</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Downloads</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none text-dark">About</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Philosophy</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Press & media</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Careers</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Zerodha Cares (CSR)</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Zerodha.tech</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Open source</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Quick links</h6>
            <ul className="list-unstyled small">
              <li><a href="#" className="text-decoration-none text-dark">Upcoming IPOs</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Brokerage charges</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Market holidays</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Economic calendar</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Calculators</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Markets</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Sectors</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="row mt-4">
          <div className="col">
            <p className="small text-muted" style={{ lineHeight: "1.6" }}>
              Zerodha Broking Ltd.: Member of NSE, BSE & MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL:
              Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019. 
              Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School,
              J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India.
              <br /><br />
              Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF.  
              Investments in securities market are subject to market risks; read all related documents carefully before investing.
              <br /><br />
              As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others.
              If you find anyone claiming to be part of Zerodha and offering such services, please create a ticket here.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-dark text-white text-center py-3 mt-4">
        <small>
          NSE | BSE | MCX &nbsp; • &nbsp;
          <a href="#" className="text-white text-decoration-none">Terms & conditions</a> &nbsp; • &nbsp;
          <a href="#" className="text-white text-decoration-none">Privacy policy</a> &nbsp; • &nbsp;
          <a href="#" className="text-white text-decoration-none">Investor charter</a>
        </small>
      </div>
    </footer>
  );
}

export default Footer;
