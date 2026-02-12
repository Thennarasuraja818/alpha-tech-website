import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import productDetails from "../../data/productDetails.json";
import { toast } from "react-toastify";

const ProductListing = () => {
    const { subcategoryId } = useParams();
    const [productData, setProductData] = useState(null);
    const dispatch = useDispatch();

    // State to track quantity for each item
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        if (subcategoryId && productDetails[subcategoryId]) {
            setProductData(productDetails[subcategoryId]);
        } else {
            setProductData(productDetails["o-rings"]);
        }
    }, [subcategoryId]);

    const handleQuantityChange = (partNo, value) => {
        const val = parseInt(value);
        if (val < 1) return;
        setQuantities({
            ...quantities,
            [partNo]: val || 1
        });
    };

    const incrementQty = (partNo) => {
        const currentQty = quantities[partNo] || 1;
        handleQuantityChange(partNo, currentQty + 1);
    };

    const decrementQty = (partNo) => {
        const currentQty = quantities[partNo] || 1;
        if (currentQty > 1) {
            handleQuantityChange(partNo, currentQty - 1);
        }
    };

    const handleAddToCart = (item) => {
        const qty = quantities[item.partNo] || 1;
        dispatch(addToCart({
            id: item.partNo,
            name: `${productData.title} - ${item.partNo}`,
            partNo: item.partNo,
            quantity: qty,
            image: productData.image || "/img/product-seal-1.png"
        }));
        toast.success(`Added ${qty} x ${item.partNo} to cart!`, {
            style: { boxShadow: 'none', border: '1px solid #e2e8f0' }
        });
    };

    if (!productData) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', marginTop: '80px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="product-listing-page pb-5" style={{ marginTop: '80px', backgroundColor: '#f8f9fa' }}>
            {/* 1. Enhanced Breadcrumb Header */}
            {/* <div className="bg-white border-bottom py-3 mb-4 shadow-sm sticky-top" style={{ top: '100px', zIndex: 900 }}>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted small fw-bold">HOME</Link></li>
                            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted small fw-bold">PRODUCTS</Link></li>
                            <li className="breadcrumb-item active small fw-bold text-primary" aria-current="page">{productData.title.toUpperCase()}</li>
                        </ol>
                    </nav>
                </div>
            </div> */}

            <div className="container">
                {/* 2. Modern Product Intro Section */}
                <div className="card border-0 shadow-sm mb-5 overflow-hidden rounded-4">
                    <div className="row g-0">
                        {/* Image Column */}
                        <div className="col-lg-5 bg-white d-flex align-items-center justify-content-center p-5 position-relative">
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-light opacity-50" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <img
                                src={productData.image || "/img/product-seal-1.png"}
                                alt={productData.title}
                                className="img-fluid position-relative z-1 hover-scale transition-transform"
                                style={{ maxHeight: '350px', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
                            />
                        </div>

                        {/* Content Column */}
                        <div className="col-lg-7 bg-white">
                            <div className="card-body p-5 d-flex flex-column h-100 justify-content-center">
                                <h1 className="fw-bold mb-2 display-5 text-primary">{productData.title}</h1>
                                <div className="d-flex align-items-center mb-4">
                                    <span className="badge me-2" style={{ backgroundColor: "var(--primary-color)" }}>Industrial Grade</span>
                                    <span className="badge " style={{ backgroundColor: "var(--accent-color)" }}>In Stock</span>
                                </div>
                                <div className="mb-4" style={{ height: '4px', width: '80px', backgroundColor: 'var(--accent-color)', borderRadius: '2px' }}></div>
                                <p className=" lead mb-4" style={{ maxWidth: '600px' }}>{productData.description}</p>

                                <div className="row g-3 mt-auto">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light-subtle h-100">
                                            <i className="bi bi-shield-check fs-3 text-primary me-3"></i>
                                            <div>
                                                <small className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Quality</small>
                                                <span className="fw-bold text-dark">ISO 9001:2015</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light-subtle h-100">
                                            <i className="bi bi-box-seam fs-3 text-primary me-3"></i>
                                            <div>
                                                <small className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Availability</small>
                                                <span className="fw-bold text-dark">Bulk Orders</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light-subtle h-100">
                                            <i className="bi bi-truck fs-3 text-primary me-3"></i>
                                            <div>
                                                <small className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Delivery</small>
                                                <span className="fw-bold text-dark">Fast Shipping</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Enhanced Product Table */}
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="card-header bg-white py-4 px-4 border-bottom d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-1 fw-bold text-primary">Technical Specifications</h4>
                            <p className="mb-0 text-muted small">Select your required size and material below.</p>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 custom-table">
                            <thead className="text-white small text-uppercase fw-bold" style={{ backgroundColor: 'var(--primary-color)' }}>
                                <tr>
                                    <th className="py-3 ps-4 border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>Part No.</th>
                                    <th className="py-3 border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>ID (mm)</th>
                                    <th className="py-3 border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>OD (mm)</th>
                                    <th className="py-3 border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>Thk (mm)</th>
                                    <th className="py-3 border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>Material</th>
                                    <th className="py-3 border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>Mould No.</th>
                                    <th className="py-3 border-bottom-0 text-center" style={{ width: '100px', backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>Quantity</th>
                                    <th className="py-3 pe-4 text-center border-bottom-0" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.specs && productData.specs.length > 0 ? (
                                    productData.specs.map((item, index) => (
                                        <tr key={index} className="group-item">
                                            <td className="fw-bold ps-4 font-monospace" style={{ backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>{item.partNo}</td>
                                            <td className="fw-medium">{item.id || '-'}</td>
                                            <td className="fw-medium">{item.od || '-'}</td>
                                            <td className="fw-medium">{item.thk || '-'}</td>
                                            <td>
                                                <span className="badge fw-medium px-3 py-2 rounded-pill"
                                                    style={{
                                                        backgroundColor: 'var(--accent-color)',
                                                        color: '#ffffff'
                                                    }}>
                                                    {item.material || 'Standard'}
                                                </span>
                                            </td>
                                            <td className="text-muted small font-monospace">{item.mouldNo || 'N/A'}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center border-secondary-subtle mx-auto"
                                                    min="1"
                                                    style={{
                                                        width: '70px',
                                                        padding: '0.25rem 20px 0.25rem 0.5rem !important', /* Right padding for arrows */
                                                        height: 'calc(1.5em + 0.5rem + 2px) !important',
                                                        fontSize: '0.875rem !important',
                                                        lineHeight: '1.5 !important'
                                                    }}
                                                    value={quantities[item.partNo] || 1}
                                                    onChange={(e) => handleQuantityChange(item.partNo, e.target.value)}
                                                />
                                            </td>
                                            <td className="pe-4 text-center">
                                                <button
                                                    className="btn btn-sm fw-bold d-inline-flex align-items-center shadow-none btn-add-cart"
                                                    onClick={() => handleAddToCart(item)}
                                                    style={{ padding: '0.4rem 1.2rem' }}
                                                >
                                                    <i className="bi bi-cart-plus me-2"></i> Add
                                                </button>
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr><td colSpan="8" className="text-center py-5 text-muted">No specifications available for this category.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>
                {`
                .hover-scale {
                    transition: transform 0.3s ease;
                }
                
                .hover-scale:hover {
                    transform: scale(1.02);
                }

                .custom-table tbody tr {
                    transition: background-color 0.2s ease;
                }
                
                .custom-table tbody tr:hover td:not(:first-child) {
                    background-color: #e3f2fd;
                }

                .input-group.quantity-control .btn {
                    border-color: #dee2e6;
                }
                
                .input-group.quantity-control .btn:hover {
                    background-color: #f1f3f5;
                    color: var(--primary-color);
                }

                .btn-add-cart {
                    background-color: transparent;
                    border: 2px solid var(--accent-color);
                    color: var(--accent-color);
                    transition: all 0.3s ease;
                }

                .btn-add-cart:hover {
                    background-color: var(--primary-color);
                    border-color: var(--primary-color);
                    color: white;
                }

                /* Always show number input arrows */
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    opacity: 1;
                }
                `}
            </style>
        </div >
    );
};

export default ProductListing;
