function DematAMC() {
  return (
    <div className="mb-5">
      <h4 className="mb-3">Demat AMC (Annual Maintenance Charge)</h4>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Value of holdings</th>
            <th>AMC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Up to ₹4 lakh</td>
            <td>Free*</td>
          </tr>
          <tr>
            <td>₹4 lakh – ₹10 lakh</td>
            <td>₹100 per year (charged quarterly)*</td>
          </tr>
          <tr>
            <td>Above ₹10 lakh</td>
            <td>₹300 per year (charged quarterly)</td>
          </tr>
        </tbody>
      </table>

      <p className="text-muted small">
        * Lower AMC applicable only for BSDA accounts.
      </p>
    </div>
  );
}
export default DematAMC;  
