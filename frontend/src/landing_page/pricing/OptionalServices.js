function OptionalServices() {
  return (
    <div className="mb-5">
      <h4 className="mb-3">Charges for optional value added services</h4>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Service</th>
            <th>Billing Frequency</th>
            <th>Charges</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tickertape</td>
            <td>Monthly / Annual</td>
            <td>Free: ₹0 | Pro: ₹249 / ₹2399</td>
          </tr>
          <tr>
            <td>Smallcase</td>
            <td>Per transaction</td>
            <td>Buy: ₹100 | SIP: ₹10</td>
          </tr>
          <tr>
            <td>Kite Connect</td>
            <td>Monthly</td>
            <td>Connect: ₹500 | Personal: Free</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default OptionalServices;    