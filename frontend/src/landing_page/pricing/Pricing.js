import React, { useState } from "react";
import PricingHero from "../home/Pricing";
import EquityTable from "./EquityTable";
import DematAMC from "./DematAMC";  
import OptionalServices from "./OptionalServices";


function Pricing() {
  const [activeTab, setActiveTab] = useState("equity");

  return (
    <>
      <PricingHero showLink={false} />

      <div className="container mb-5">

        {/* TABS */}
        <div className="d-flex gap-4 border-bottom mb-4">
          {["equity", "currency", "commodity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn border-0 pb-2 ${
                activeTab === tab
                  ? "fw-bold border-bottom border-primary"
                  : "text-muted"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* TABLE */}
        {activeTab === "equity" && <EquityTable />}

        {/* CALCULATOR CTA */}
        <div className="mb-5">
          <p className="fw-medium">
            Calculate your costs upfront using our{" "}
            <a href="#" className="text-decoration-none">
              brokerage calculator
            </a>
          </p>
        </div>

       
        {/* DEMAT AMC */}
        <DematAMC />

        {/* OPTIONAL SERVICES */}
        <OptionalServices />

      </div>
    </>
  );
}

export default Pricing;
