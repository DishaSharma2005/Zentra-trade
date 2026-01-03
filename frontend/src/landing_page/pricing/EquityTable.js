import React from "react";

function EquityTable() {
  return (
    <div className="table-responsive mb-5">
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th></th>
            <th>Equity Delivery</th>
            <th>Equity Intraday</th>
            <th>F&O - Futures</th>
            <th>F&O - Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brokerage</td>
            <td>Zero Brokerage</td>
            <td>0.03% or ₹20</td>
            <td>0.03% or ₹20</td>
            <td>Flat ₹20</td>
          </tr>

          <tr>
            <td>STT / CTT</td>
            <td>0.1% on buy & sell</td>
            <td>0.025% on sell</td>
            <td>0.02% on sell</td>
            <td>0.1% on sell (premium)</td>
          </tr>

          <tr>
            <td>Transaction charges</td>
            <td colSpan="4">
              NSE: 0.00297% | BSE: 0.00375%
            </td>
          </tr>

          <tr>
            <td>GST</td>
            <td colSpan="4">
              18% on (brokerage + SEBI charges + transaction charges)
            </td>
          </tr>

          <tr>
            <td>SEBI charges</td>
            <td colSpan="4">₹10 / crore</td>
          </tr>

          <tr>
            <td>Stamp charges</td>
            <td>0.015% (buy)</td>
            <td>0.003% (buy)</td>
            <td>0.002% (buy)</td>
            <td>0.003% (buy)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EquityTable;
