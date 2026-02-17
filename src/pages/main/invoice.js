import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import apiProvider from "../../apiProvider/api";
import InvoiceTemplate2 from "../../components/InvoiceTemplate2";
import { toast } from "react-toastify";

const Invoice = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const result = await apiProvider.orderDetails(orderId);
      if (result && result.status) {
        setOrderData(result.response.data);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    const downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) downloadBtn.style.display = "none";

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${orderData.orderCode || id}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download invoice");
    } finally {
      if (downloadBtn) downloadBtn.style.display = "block";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', marginTop: '80px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container text-center" style={{ marginTop: '150px' }}>
        <h3>Order not found</h3>
      </div>
    );
  }

  return (
    <div className="invoice-page-wrapper" style={{ marginTop: '100px', paddingBottom: '50px', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="d-flex justify-content-between pt-4 align-items-center mb-4">
          <h4 className="fw-bold">Tax Invoice</h4>
          <button
            id="download-btn"
            className="btn btn-danger d-flex align-items-center gap-2"
            onClick={handleDownload}
          >
            <i className="bi bi-download"></i>
            Download Invoice
          </button>
        </div>

        <div className="invoice-container shadow-sm p-4 bg-white rounded mx-auto" style={{ maxWidth: '850px' }}>
          <div ref={invoiceRef}>
            <InvoiceTemplate2 orderData={orderData} InvoiceData={orderData?.InvoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
