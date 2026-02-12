import React from "react";

const Invoice = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "8rem auto 2rem", padding: "2rem", border: "1px solid #dee2e6", borderRadius: "0.5rem", fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#212529" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", textAlign: "left" }}>
        <div>
          <img src="/img/ilab-logo.png" alt="Site Logo" style={{ height: "80px", marginBottom: "0.5rem" }} />
          <div style={{ fontSize: "13px", color: "#6c757d" }}>
            <p style={{ margin: 0, color: "#111", fontWeight: "700" }}>iLap</p>
            <p style={{ margin: 0 }}>Office no 442A, Al Ghurair Centre - Office Tower</p>
            <p style={{ margin: 0 }}>Deira Dubai, Dubai UAE, United Arab Emirates</p>
            <p style={{ margin: 0 }}>TRN 104300720000003</p>
            <p style={{ margin: 0 }}>arun@hal.ae</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
        <h2 style={{ margin: "1.5rem 0" }}>TAX INVOICE <br></br><span style={{ fontSize: "15px"}}><strong># INV-000001</strong></span></h2>

        <div style={{ marginBottom: "1rem" }}>

        <div style={{ color: "#6c757d" }}>Balance Due </div>
        <div style={{ color: "#6c757d" }}>AED313.95</div>
      </div>
        </div>
      </div>





      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", textAlign: "left" }}>
        <div>
          <h6 style={{ margin: 0, fontSize: "14px", color: "#212529" }}>Bill To</h6>
          <p style={{ margin: 0, color: "#111", fontWeight: "700" }}>HAL Training Institute LLC</p>
        </div>
        <div style={{ textAlign: "right", color: "#6c757d" }}>
          <div>Invoice Date: 12 Apr 2025</div>
          <div>Due Date: 12 Apr 2025</div>
          <div>Terms: Due On Receipt</div>
        </div>
      </div>

      <table className="table-responsive" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem", textAlign: "left", overflowx: "auto" }}>
        <thead style={{ backgroundColor: "#f8f9fa", overflowx: "auto" }}>
          <tr>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>#</th>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>Item & Description</th>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>Qty</th>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>Rate</th>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>Taxable Amount</th>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>Tax</th>
            <th style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>1</td>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>
              <strong>JavaScript Essentials Course</strong><br />
              Online course access for Anbu Elumalai
            </td>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>1.00</td>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>299.00</td>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>299.00</td>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>14.95 <br></br> 15%</td>
            <td style={{ border: "1px solid #dee2e6", padding: "0.5rem" }}>313.95</td>
          </tr>

          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><b>Sub Total</b></td>
            <td>299.00</td>
            <td>14.95</td>
            <td>313.95</td>
          </tr>
        </tbody>
      </table>


      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <p style={{ marginBottom: "10px" }}><strong>Total:</strong>  AED313.95</p>

        <p style={{ margin: 0 }}> <strong>Balance Due:</strong> AED313.95</p>
      </div>

      <div style={{ marginTop: "1.5rem", fontSize: "13px", textAlign: "left" }}>
        <h6 style={{marginBottom: "1rem"}}>Tax Summary</h6>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              <th style={{ border: "1px solid #dee2e6", padding: "0.5rem", width: "60%" }}>Tax Details</th>
              <th style={{ border: "1px solid #dee2e6", padding: "0.5rem", textAlign: "right" }}>Taxable Amount (AED)</th>
              <th style={{ border: "1px solid #dee2e6", padding: "0.5rem", textAlign: "right" }}>Tax Amount (AED)</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td style={{ border: "1px solid #dee2e6", padding: "0.5rem", width: "60%",  }}>Standard Rate (5%)</td>
              <td style={{ border: "1px solid #dee2e6", padding: "0.5rem", textAlign: "right" }}>299.00</td>
              <td style={{ border: "1px solid #dee2e6", padding: "0.5rem", textAlign: "right" }}>14.95</td>
            </tr>

            <tr>
              <td style={{ border: "1px solid #dee2e6", padding: "0.5rem", width: "60%" }}><strong>Total</strong></td>
              <td style={{ border: "1px solid #dee2e6", padding: "0.5rem", textAlign: "right" }}><strong>AED299.00</strong></td>
              <td style={{ border: "1px solid #dee2e6", padding: "0.5rem", textAlign: "right" }}><strong>AED14.95</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "1.5rem", fontSize: "13px", textAlign: "left" }}>
        <strong>Notes:</strong>
        <p>Invoice for JavaScript course purchase</p>
      </div>
    </div>
  );
};

export default Invoice;