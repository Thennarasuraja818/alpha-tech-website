import React from "react";

// Mocking ProductQRCode if not available in web project
const ProductQRCode = ({ productUrl, size }) => {
    if (!productUrl) return null;
    return (
        <div style={{ width: size, height: size, border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', textAlign: 'center' }}>
            <img src={productUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
    );
};

const InvoiceTemplate2 = ({ orderData, InvoiceData }) => {
    console.error("orderData", orderData);
    if (!orderData) return null;

    // Style constants
    const thStyle = {
        border: "1px solid #000",
        fontWeight: "bold",
        padding: "2px",
    };

    const tdStyle = {
        borderLeft: "1px solid #000",
        borderRight: "1px solid #000",
        padding: "2px",
        verticalAlign: "middle",
    };

    // Helper functions
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, "-");
    };

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0)?.toFixed(2);
    };

    const getAmountInWords = (num) => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

        function convertLessThanOneThousand(n) {
            if (n === 0) return "";
            if (n < 10) return ones[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
            return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convertLessThanOneThousand(n % 100) : "");
        }

        if (num === 0) return "Zero Rupees Only";
        let n = Math.floor(num);
        let result = "";
        if (Math.floor(n / 10000000) > 0) { result += convertLessThanOneThousand(Math.floor(n / 10000000)) + " Crore "; n %= 10000000; }
        if (Math.floor(n / 100000) > 0) { result += convertLessThanOneThousand(Math.floor(n / 100000)) + " Lakh "; n %= 100000; }
        if (Math.floor(n / 1000) > 0) { result += convertLessThanOneThousand(Math.floor(n / 1000)) + " Thousand "; n %= 1000; }
        if (n > 0) { result += convertLessThanOneThousand(n); }
        return result + " Rupees Only";
    };

    // Extract data from order
    const {
        orderCode = "",
        createdAt = "",
        shippingAddress = {},
        user = {},
        items = [],
        products = [],
        breakdown = {},
        paymentMode = "",
        invoiceId = "",
        totalDiscount = 0,
        gstNumber,
    } = orderData.data || orderData || {};

    const {
        subTotal = 0,
        roundoff = 0,
        subtotalAfterDiscount = 0,
        tax = 0,
        shippingCharge = 0,
        total = 0,
    } = breakdown;

    const totalGross = subTotal + tax;
    const totalSubTotal = subtotalAfterDiscount + tax;
    const itemDiscounts = items.reduce((sum, item) => sum + (item.discount || 0), 0);
    const lessFrightChargee = totalDiscount;

    // Calculate tax breakdown
    const taxGroups = items.reduce((acc, item, index) => {
        const taxRate = item.taxRate || 0;
        if (!acc[taxRate]) acc[taxRate] = { totalAmount: 0, totalTax: 0, count: 0 };
        const taxableAmount = (item.unitPrice || 0) * (item.quantity || 0) - (item.discount || 0);
        const taxAmount = (taxableAmount * taxRate) / 100;
        acc[taxRate].totalAmount += (taxableAmount - taxAmount);
        acc[taxRate].totalTax += taxAmount;
        return acc;
    }, {});

    // Map products
    const productDetails = items.map((item, index) => {
        const product = (products && products[index]) || {};
        const taxRate = item.taxRate || 0;
        const itemTotal = item.unitPrice * item.quantity;
        const itemDiscount = item.discount || 0;
        return {
            ...item,
            ...product,
            productName: product.productName || 'Product',
            variantName: item.attributes?.variantName || 'Product',
            quantity: item.quantity || 0,
            index: index + 1,
            itemTotal: itemTotal,
            itemDiscount: itemDiscount,
        };
    });

    const totalWeight = productDetails.reduce((sum, p) => sum + (p.quantity || 0), 0);

    const calculateItemsPerPage = () => {
        const footerHeight = 120;
        const headerHeight = 40;
        const customerDetailsHeight = 15;
        const pageHeight = 210;
        const availableHeight = pageHeight - headerHeight - customerDetailsHeight - footerHeight;
        const rowHeight = 3.2;
        return Math.max(1, Math.floor(availableHeight / rowHeight) - 1);
    };

    const itemsPerPage = calculateItemsPerPage();
    const totalPages = Math.ceil(productDetails.length / itemsPerPage);
    const lastPageCount = productDetails.length % itemsPerPage || itemsPerPage;
    const needsExtraPage = lastPageCount === itemsPerPage || lastPageCount > itemsPerPage - 2;

    const renderPage = (pageNumber, isFooterOnlyPage = false) => {
        const startIndex = pageNumber * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, productDetails.length);
        const pageProducts = productDetails.slice(startIndex, endIndex);
        const emptyRows = itemsPerPage - pageProducts.length;

        let isLastPage = pageNumber === totalPages - 1 && !isFooterOnlyPage;
        if (isLastPage && (emptyRows === 0 || emptyRows < 2)) isLastPage = false;

        return (
            <div
                key={pageNumber}
                style={{
                    width: "148mm",
                    height: "210mm",
                    margin: "0 auto",
                    padding: "3mm",
                    fontFamily: "Arial",
                    backgroundColor: "white",
                    fontSize: "8px",
                    lineHeight: "1.4",
                    boxSizing: "border-box",
                    border: "2px solid #000",
                    pageBreakAfter: "always",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "5px", marginBottom: "8px", borderBottom: "1px solid #000", flexShrink: 0 }}>
                    <div style={{ width: "25%", textAlign: "left" }}>
                        <img src="/img/alpha-logo.png" alt="Company Logo" style={{ height: "70px", width: "160px", objectFit: "contain" }} />
                    </div>
                    <div style={{ textAlign: "center", width: "50%" }}>
                        <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "3px" }}>Alpha Technical Rubber Sheets</div>
                        <div style={{ fontSize: "9px", lineHeight: "1.3" }}>
                            <div>W.L.L</div>
                            <div>Bldg 123, Road 456, Block 789 Manama,</div>
                            <div> Kingdom of Bahrain</div>
                            {/* <div><strong>Email:</strong> sales@alphatechrubber.com</div> */}
                            <div><strong>Ph:</strong> +973 1700 6820</div>
                        </div>
                    </div>
                    {/* <div style={{ width: "25%", textAlign: "right", fontSize: "9px" }}>
                        <img src="/assets/images/logo/fssi-logo.png" alt="FSSAI Logo" style={{ height: "40px", width: "70px", objectFit: "contain", marginBottom: "3px" }} />
                        <div><strong>FSSAI: 12419003002919</strong></div>
                    </div> */}
                </div>

                {/* Customer Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "start", gap: "5px", border: "1px solid #000", padding: "10px", marginBottom: "10px", fontSize: "10px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: "10px", textAlign: "left" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                            <div style={{ textAlign: "left" }}><strong>Name:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{shippingAddress.contactName || "N/A"}</span></div>
                            <div style={{ textAlign: "left" }}><strong>Address:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{shippingAddress.addressLine || shippingAddress.street || "N/A"}</span></div>
                            <div style={{ textAlign: "left" }}><strong>Ph:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{shippingAddress.contactNumber || "N/A"}</span></div>
                            <div style={{ textAlign: "left" }}><strong>GSTIN:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{gstNumber || "N/A"}</span></div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                            <div style={{ textAlign: "left" }}><strong>Inv. No:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{invoiceId || orderCode}</span></div>
                            <div style={{ textAlign: "left" }}><strong>Bill Date:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{formatDate(createdAt)}</span></div>
                            <div style={{ textAlign: "left" }}><strong>Bill Type:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{paymentMode}</span></div>
                            <div style={{ textAlign: "left" }}><strong>Area:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{shippingAddress.city || "N/A"}</span></div>
                            <div style={{ textAlign: "left" }}><strong>Order BY:</strong> <span style={{ fontWeight: "bold", fontSize: "11px" }}>{orderData?.userName || "N/A"}</span></div>
                        </div>
                    </div>
                    {/* {InvoiceData?.SignedQRCode && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "5px" }}>
                            <ProductQRCode productUrl={InvoiceData?.SignedQRCode} size={100} />
                        </div>
                    )} */}
                </div>

                {/* Products Table */}
                <div style={{ marginBottom: "10px", flexGrow: 1, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px", border: "1px solid #000", tableLayout: "fixed" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#1a2238", color: "#fff", borderBottom: "1px solid #000" }}>
                                <th style={{ ...thStyle, padding: "12px", width: "5%" }}>S.No</th>
                                <th style={{ ...thStyle, padding: "12px", width: "35%", textAlign: "left" }}>Product</th>
                                <th style={{ ...thStyle, padding: "12px", width: "10%" }}>HSN</th>
                                <th style={{ ...thStyle, padding: "12px", width: "10%" }}>GST</th>
                                <th style={{ ...thStyle, padding: "12px", width: "10%" }}>Qty</th>
                                <th style={{ ...thStyle, padding: "12px", width: "10%" }}>Rate</th>
                                <th style={{ ...thStyle, padding: "12px", width: "8%" }}>Disc</th>
                                <th style={{ ...thStyle, padding: "12px", width: "12%" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageProducts.map((p, i) => (
                                <tr key={i}>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{p.index}</td>
                                    <td style={{ ...tdStyle, textAlign: "left", fontWeight: "bold", fontSize: "10px" }}>{p.productName} - ({p.variantName})</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{p.hsn || "N/A"}</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{p.taxRate}%</td>
                                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold", fontSize: "10px" }}>{p.quantity || 0}</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{formatCurrency(p.unitPrice)}</td>
                                    <td style={{ ...tdStyle, textAlign: "center" }}>{p.discount || 0}</td>
                                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: "bold", fontSize: "10px" }}>{formatCurrency(p.itemTotal)}</td>
                                </tr>
                            ))}
                            {[...Array(emptyRows)].map((_, i) => (
                                <tr key={`empty-${i}`} style={{ height: "12px" }}>
                                    {Array(8).fill(null).map((_, j) => <td key={j} style={tdStyle}></td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {((isLastPage && !needsExtraPage) || isFooterOnlyPage) && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", border: "1px solid #000", padding: "5px", gap: "5px", flexShrink: 0 }}>
                        <div style={{ width: "50%", textAlign: "left" }}>
                            <div style={{ marginBottom: "8px", textAlign: "left" }}><strong>Total Items: {productDetails.length}</strong></div>
                            <div style={{ marginBottom: "8px", textAlign: "left" }}><strong>Total Weight: {orderData.totalWeight || totalWeight.toFixed(2)} kg</strong></div>
                            <div style={{ marginBottom: "10px", textAlign: "left" }}>
                                <div style={{ textAlign: "left" }}><strong>Amount in Words:</strong></div>
                                <div style={{ textAlign: "left" }}>{getAmountInWords(total)}</div>
                            </div>
                            <div style={{ marginBottom: "8px", textAlign: "left" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px", border: "1px solid #000" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#1a2238", color: "#fff" }}>
                                            <th style={{ ...thStyle, padding: "4px" }}>GST%</th>
                                            <th style={{ ...thStyle, padding: "4px" }}>Sale Amt</th>
                                            <th style={{ ...thStyle, padding: "4px" }}>GST</th>
                                            <th style={{ ...thStyle, padding: "4px" }}>CGST</th>
                                            <th style={{ ...thStyle, padding: "4px" }}>SGST</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(taxGroups).filter(([r]) => parseFloat(r) > 0).map(([r, d]) => (
                                            <tr key={r}>
                                                <td style={{ ...tdStyle, textAlign: "center", padding: "2px" }}>{r}%</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹{formatCurrency(d.totalAmount)}</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹{formatCurrency(d.totalTax)}</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹{formatCurrency(d.totalTax / 2)}</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹{formatCurrency(d.totalTax / 2)}</td>
                                            </tr>
                                        ))}
                                        {Object.keys(taxGroups).filter((r) => parseFloat(r) > 0).length === 0 && (
                                            <tr>
                                                <td style={{ ...tdStyle, textAlign: "center", padding: "2px" }}>0%</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹{formatCurrency(subTotal)}</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹0.00</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹0.00</td>
                                                <td style={{ ...tdStyle, textAlign: "right", padding: "2px" }}>₹0.00</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginBottom: "5px", textAlign: "left" }}>
                                <div style={{ textAlign: "left" }}><strong>Bank: HDFC BANK</strong></div>
                                <div style={{ textAlign: "left" }}><strong>A/C No:</strong> 50200065787602</div>
                                <div style={{ textAlign: "left" }}><strong>IFSC:</strong> HDFC0002407</div>
                            </div>
                            <div style={{ fontSize: "7px", textAlign: "left" }}>
                                <div style={{ textAlign: "left" }}>Any Legal dispute solved by 1996 Arbitration act in coimbatore jurisdiction only.</div>
                                <div style={{ textAlign: "left" }}><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods and all particulars are true and correct.</div>
                            </div>
                        </div>
                        <div style={{ width: "40%" }}>
                            <div style={{ textAlign: "right", marginBottom: "10px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span>Total Amount (Gross) :</span><span>₹{formatCurrency(totalGross)}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span>Item Discounts :</span><span>-₹{formatCurrency(itemDiscounts)}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span>Sub Total :</span><span>₹{formatCurrency(totalSubTotal)}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span>Fright :</span><span>₹{formatCurrency(shippingCharge)}</span></div>
                                {lessFrightChargee > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span>Less Fright :</span><span>-₹{formatCurrency(lessFrightChargee)}</span></div>}
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span>Round Off :</span><span>₹{formatCurrency(roundoff)}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #000", paddingTop: "3px", fontSize: "16px", fontWeight: "bold", marginTop: "5px" }}>
                                    <span>Net Amount :</span><span>₹{formatCurrency(total)}</span>
                                </div>
                                <div style={{ textAlign: "right", marginTop: "3px" }}><strong>for RAMESH TRADERS</strong></div>
                            </div>
                            <div style={{ width: "60px", height: "60px", border: "1px solid #000", display: "flex", alignItems: "center", justifyContent: "center", margin: "5px auto" }}>
                                <img src="/assets/images/logo/RT-QR.jpg" alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none' }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", paddingTop: "15px", fontSize: "10px" }}>
                                <div style={{ textAlign: "left" }}>RECEIVER SIGN</div>
                                <div style={{ textAlign: "right" }}><strong>Authorized Signatory</strong></div>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ textAlign: "center", marginTop: "5px", fontSize: "9px", flexShrink: 0 }}>Page {pageNumber + 1} of {totalPages + (needsExtraPage ? 1 : 0)}</div>
            </div>
        );
    };

    return (
        <div style={{ fontFamily: "Arial" }}>
            {Array.from({ length: totalPages }, (_, i) => renderPage(i))}
            {needsExtraPage && renderPage(totalPages, true)}
        </div>
    );
};

export default InvoiceTemplate2;
