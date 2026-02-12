import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import productDetails from "../../data/productDetails.json";
import subcategoryVariants from "../../data/subcategoryVariants.json";
import { toast } from "react-toastify";
import { useTranslation } from "../../context/TranslationContext";
import HomeApi from "../../apiProvider/homeApi";
import { BASE_URL } from "../../network/apiClient";

const ProductSpecs = () => {
    const { subCategoryId, variantId: childCategoryId } = useParams();
    console.info("subCategoryId", subCategoryId);
    console.info("childCategoryId", childCategoryId);
    const [loading, setLoading] = useState(true);
    const [specs, setSpecs] = useState([]);
    const [variantData, setVariantData] = useState(null); // Store full variant data
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [quantities, setQuantities] = useState({});
    const [productList, setProductList] = useState([])
    const [heroProduct, setHeroProduct] = useState(null);

    // Technical Specifications State
    const [as568aSpecs, setAs568aSpecs] = useState([]);
    const [jisSpecs, setJisSpecs] = useState([]);
    const [activeTab, setActiveTab] = useState('as568a');
    const [showTechSpecs, setShowTechSpecs] = useState(false);

    const dispatch = useDispatch();
    const { translateSync } = useTranslation();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                childCategoryId: childCategoryId,
                subCategoryId: subCategoryId
            }
            const response = await HomeApi.ProductList(params)

            if (response.status) {
                const products = response.response?.data || [];
                setProductList(products);

                // Set specs for the table
                const formattedSpecs = products.map((item, idx) => ({
                    ...item,
                    uniqueId: item._id || idx,
                    // Map API fields
                    partNo: item.productCode || item.productName,
                    id: item.id || '-', // Placeholder if not in API
                    od: item.od || '-',
                    thk: item.thk || '-',
                    material: item.material || '-', // You might need to check key names
                    mouldNo: item.mouldNo || '-'
                }));
                setSpecs(formattedSpecs);

                // Set hero product logic
                if (products.length > 0) {
                    const hero = products[0];
                    setHeroProduct(hero);

                    setAs568aSpecs(hero.as_568a_standard || []);
                    setJisSpecs(hero.jis_b_2401_standard || []);

                    // Set active tab based on available data
                    if (hero.as_568a_standard?.length > 0) {
                        setActiveTab('as568a');
                    } else if (hero.jis_b_2401_standard?.length > 0) {
                        setActiveTab('jis');
                    }

                    // Sync variantData for display
                    setVariantData({
                        name: hero.productName,
                        desc: hero.description || hero.shortDescription,
                        image: hero.productImage?.[0]
                            ? `${BASE_URL}/${hero.productImage[0].docPath}/${hero.productImage[0].docName}`
                            : "/img/product-seal-1.png"
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching Products :", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts();
    }, [subCategoryId, childCategoryId])

    // Search / Filter Logic
    const filteredItems = specs.filter(item => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            (item.partNo && item.partNo.toLowerCase().includes(lowerTerm)) ||
            (item.material && item.material.toLowerCase().includes(lowerTerm)) ||
            (item.mouldNo && item.mouldNo.toLowerCase().includes(lowerTerm)) ||
            (item.id && String(item.id).toLowerCase().includes(lowerTerm)) ||
            (item.od && String(item.od).toLowerCase().includes(lowerTerm)) ||
            (item.thk && String(item.thk).toLowerCase().includes(lowerTerm))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleQuantityChange = (uniqueId, value) => {
        const val = parseInt(value);
        if (val < 1) return;
        setQuantities({
            ...quantities,
            [uniqueId]: val || 1
        });
    };

    const handleAddToCart = (item) => {
        const qty = quantities[item.uniqueId] || 1;
        dispatch(addToCart({
            id: item.partNo,
            name: `${variantData?.name || 'Product'} - ${item.partNo}`,
            partNo: item.partNo,
            quantity: qty,
            image: variantData?.image || "/img/product-seal-1.png"
        }));
        toast.success(`Added ${qty} x ${item.partNo} to cart!`, {
            style: { boxShadow: 'none', border: '1px solid #e2e8f0' }
        });
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', marginTop: '100px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="product-specs-page pb-5" style={{ marginTop: '100px', backgroundColor: '#f8f9fa', minHeight: '80vh' }}>
            <div className="container">

                {/* Modern Product Intro Section (Dark Theme Hero) */}
                <div className="card border-0 shadow-lg mb-5 overflow-hidden rounded-4">
                    <div className="row g-0">
                        {/* Image Column */}
                        <div className="col-lg-5 bg-white d-flex align-items-center justify-content-center p-5 position-relative">
                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <img
                                src={
                                    heroProduct?.productImage?.[0]
                                        ? `${BASE_URL}/${heroProduct.productImage[0].docPath}/${heroProduct.productImage[0].docName}`
                                        : "/img/product-seal-1.png"
                                }
                                alt={heroProduct?.productName}
                                className="img-fluid position-relative z-1 hover-scale"
                                style={{ maxHeight: '350px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))' }}
                            />
                        </div>

                        {/* Content Column */}
                        <div className="col-lg-7" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #1a1a2e 100%)' }}>
                            <div className="card-body p-5 d-flex flex-column h-100 justify-content-center text-white">
                                {/* <h1 className="fw-bold mb-3 display-5 text-white">{variantData?.name}</h1> */}
                                <h1 className="fw-bold mb-3 display-5 text-white">
                                    {heroProduct?.productName || "Product"}
                                </h1>

                                <div className="d-flex align-items-center mb-4 flex-wrap gap-2">
                                    <span className="badge px-3 py-2 rounded-pill bg-white text-primary fw-bold shadow-sm">
                                        <i className="bi bi-gear-fill me-2"></i> Industrial Grade
                                    </span>
                                    <span className="badge px-3 py-2 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: "var(--accent-color)", color: 'white' }}>
                                        <i className="bi bi-check-circle-fill me-2"></i> In Stock
                                    </span>
                                </div>

                                <div className="mb-4" style={{ height: '4px', width: '80px', backgroundColor: 'var(--accent-color)', borderRadius: '2px' }}></div>

                                <p className="lead mb-4 text-white-50" style={{ maxWidth: '600px' }}>
                                    {heroProduct?.description || heroProduct?.shortDescription || "Product description not available"}
                                </p>

                                <div className="row g-3 mt-auto">
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center p-3 rounded-3 h-100 feature-box"
                                            style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <i className="bi bi-shield-check fs-3 text-white me-3 opacity-75"></i>
                                            <div>
                                                <small className="d-block text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Quality</small>
                                                <span className="fw-bold">ISO 9001:2015</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center p-3 rounded-3 h-100 feature-box"
                                            style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <i className="bi bi-box-seam fs-3 text-white me-3 opacity-75"></i>
                                            <div>
                                                <small className="d-block text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Orders</small>
                                                <span className="fw-bold">Bulk & Retail</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center p-3 rounded-3 h-100 feature-box"
                                            style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <i className="bi bi-truck fs-3 text-white me-3 opacity-75"></i>
                                            <div>
                                                <small className="d-block text-white-50 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Shipping</small>
                                                <span className="fw-bold">Fast Delivery</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TECHNICAL SPECIFICATIONS SECTION - NEW */}
                {(as568aSpecs.length > 0 || jisSpecs.length > 0) && (
                    <div className="card border-0 shadow-lg rounded-4 mb-4">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold mb-1">
                                        <i className="bi bi-rulers me-2" style={{ color: 'var(--primary-color)' }}></i>
                                        Technical Specifications
                                    </h4>
                                    <p className="text-muted small mb-0">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Engineering reference measurements and tolerances
                                    </p>
                                </div>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => setShowTechSpecs(!showTechSpecs)}
                                >
                                    <i className={`bi bi-chevron-${showTechSpecs ? 'up' : 'down'} me-1`}></i>
                                    {showTechSpecs ? 'Hide' : 'View'} Details
                                </button>
                            </div>
                        </div>

                        {showTechSpecs && (
                            <div className="card-body p-4">
                                {/* Tabs */}
                                <ul className="nav nav-pills mb-4">
                                    {as568aSpecs.length > 0 && (
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'as568a' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('as568a')}
                                                style={activeTab === 'as568a' ? { backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' } : {}}
                                            >
                                                <i className="bi bi-flag-fill me-2"></i>
                                                AS 568A Standard
                                            </button>
                                        </li>
                                    )}
                                    {jisSpecs.length > 0 && (
                                        <li className="nav-item ms-2">
                                            <button
                                                className={`nav-link ${activeTab === 'jis' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('jis')}
                                                style={activeTab === 'jis' ? { backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' } : {}}
                                            >
                                                <i className="bi bi-flag-fill me-2"></i>
                                                JIS B 2401 Standard
                                            </button>
                                        </li>
                                    )}
                                </ul>

                                {/* AS 568A Table */}
                                {activeTab === 'as568a' && as568aSpecs.length > 0 && (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th rowSpan="2" className="align-middle text-center fw-bold">Size Code</th>
                                                    <th colSpan="3" className="text-center bg-info bg-opacity-10 fw-bold">Nominal (IN)</th>
                                                    <th colSpan="4" className="text-center bg-warning bg-opacity-10 fw-bold">Standard (IN)</th>
                                                    <th colSpan="4" className="text-center bg-success bg-opacity-10 fw-bold">Metric (MM)</th>
                                                </tr>
                                                <tr>
                                                    {/* Nominal */}
                                                    <th className="bg-info bg-opacity-10 small">ID</th>
                                                    <th className="bg-info bg-opacity-10 small">OD</th>
                                                    <th className="bg-info bg-opacity-10 small">CS</th>
                                                    {/* Standard */}
                                                    <th className="bg-warning bg-opacity-10 small">ID</th>
                                                    <th className="bg-warning bg-opacity-10 small">±</th>
                                                    <th className="bg-warning bg-opacity-10 small">CS</th>
                                                    <th className="bg-warning bg-opacity-10 small">±</th>
                                                    {/* Metric */}
                                                    <th className="bg-success bg-opacity-10 small">ID</th>
                                                    <th className="bg-success bg-opacity-10 small">±</th>
                                                    <th className="bg-success bg-opacity-10 small">CS</th>
                                                    <th className="bg-success bg-opacity-10 small">±</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {as568aSpecs.map((spec, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-bold text-center font-monospace" style={{ color: 'var(--primary-color)' }}>
                                                            {spec.sizeCode}
                                                        </td>
                                                        {/* Nominal */}
                                                        <td className="text-center small">{spec.nominal_id_in || '-'}</td>
                                                        <td className="text-center small">{spec.nominal_od_in || '-'}</td>
                                                        <td className="text-center small">{spec.nominal_cs_in || '-'}</td>
                                                        {/* Standard */}
                                                        <td className="text-center small">{spec.standard_id_in || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.standard_id_tolerance_in || '-'}</td>
                                                        <td className="text-center small">{spec.standard_cs_in || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.standard_cs_tolerance_in || '-'}</td>
                                                        {/* Metric */}
                                                        <td className="text-center small fw-semibold">{spec.metric_id_mm || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.metric_id_tolerance_mm || '-'}</td>
                                                        <td className="text-center small fw-semibold">{spec.metric_cs_mm || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.metric_cs_tolerance_mm || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* JIS B 2401 Table */}
                                {activeTab === 'jis' && jisSpecs.length > 0 && (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th rowSpan="2" className="align-middle text-center fw-bold">Size Code</th>
                                                    <th colSpan="4" className="text-center bg-success bg-opacity-10 fw-bold">Metric (MM)</th>
                                                    <th colSpan="4" className="text-center bg-warning bg-opacity-10 fw-bold">Inches (IN)</th>
                                                </tr>
                                                <tr>
                                                    {/* Metric */}
                                                    <th className="bg-success bg-opacity-10 small">ID</th>
                                                    <th className="bg-success bg-opacity-10 small">±</th>
                                                    <th className="bg-success bg-opacity-10 small">CS</th>
                                                    <th className="bg-success bg-opacity-10 small">±</th>
                                                    {/* Inches */}
                                                    <th className="bg-warning bg-opacity-10 small">ID</th>
                                                    <th className="bg-warning bg-opacity-10 small">±</th>
                                                    <th className="bg-warning bg-opacity-10 small">CS</th>
                                                    <th className="bg-warning bg-opacity-10 small">±</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jisSpecs.map((spec, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-bold text-center font-monospace" style={{ color: 'var(--primary-color)' }}>
                                                            {spec.sizeCode}
                                                        </td>
                                                        {/* Metric */}
                                                        <td className="text-center small fw-semibold">{spec.metric_id_mm || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.metric_id_tolerance_mm || '-'}</td>
                                                        <td className="text-center small fw-semibold">{spec.metric_cs_mm || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.metric_cs_tolerance_mm || '-'}</td>
                                                        {/* Inches */}
                                                        <td className="text-center small">{spec.inch_id_in || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.inch_id_tolerance_in || '-'}</td>
                                                        <td className="text-center small">{spec.inch_cs_in || '-'}</td>
                                                        <td className="text-center small text-muted">{spec.inch_cs_tolerance_in || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Info Alert */}
                                <div className="alert alert-info d-flex align-items-start mb-0 mt-3">
                                    <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                                    <small>
                                        <strong>Note:</strong> These are standard engineering measurements.
                                        {activeTab === 'as568a'
                                            ? ' AS 568A is the American standard for O-Ring dimensions with nominal (reference), standard (decimal), and metric measurements.'
                                            : ' JIS B 2401 is the Japanese Industrial Standard. G-series is used for static sealing applications, P-series for dynamic sealing applications.'
                                        }
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Filter & Controls */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 ps-3"><i className="bi bi-search text-muted"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search by Part No, ID, OD, Thickness, Material..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 text-md-end text-muted small">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} results
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 custom-specs-table">
                            <thead className="small text-uppercase fw-bold" style={{ backgroundColor: 'var(--primary-color)' }}>
                                <tr>
                                    <th className="py-3 ps-4 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>Part No.</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>ID (mm)</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>OD (mm)</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>Thk (mm)</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>Material</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>Mould No.</th>
                                    <th className="py-3 text-center text-white" style={{ width: '100px', backgroundColor: 'var(--primary-color)' }}>Qty</th>
                                    <th className="py-3 pe-4 text-center text-white" style={{ backgroundColor: 'var(--primary-color)' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.uniqueId}>
                                            <td className="fw-bold ps-4 font-monospace" style={{ color: 'var(--primary-color)' }}>{item.partNo}</td>
                                            <td>{item.id}</td>
                                            <td>{item.od}</td>
                                            <td>{item.thk}</td>
                                            <td>
                                                <span className="badge fw-medium px-2 py-1 rounded-pill bg-light text-dark border">
                                                    {item.material}
                                                </span>
                                            </td>
                                            <td className="text-muted small font-monospace">{item.mouldNo}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center border-secondary-subtle"
                                                    min="1"
                                                    value={quantities[item.uniqueId] || 1}
                                                    onChange={(e) => handleQuantityChange(item.uniqueId, e.target.value)}
                                                />
                                            </td>
                                            <td className="pe-4 text-center">
                                                <button
                                                    className="btn btn-primary btn-sm px-3 py-2 shadow-sm d-flex align-items-center mx-auto"
                                                    onClick={() => handleAddToCart(item)}
                                                >
                                                    <i className="bi bi-cart-plus me-2"></i> Add to Cart
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            <i className="bi bi-search display-6 d-block mb-3 opacity-25"></i>
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="card-footer bg-white border-top-0 py-3">
                            <nav>
                                <ul className="pagination justify-content-center mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                .hover-scale {
                    transition: transform 0.3s ease;
                }
                .hover-scale:hover {
                    transform: scale(1.05);
                }
                .feature-box {
                    transition: all 0.3s ease;
                }
                .feature-box:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-2px);
                }
                .custom-specs-table tbody tr {
                    transition: background-color 0.2s ease;
                }
                .custom-specs-table tbody tr:hover td {
                    background-color: #f8fafc;
                }
                .page-link {
                    color: var(--primary-color);
                    border: none;
                    margin: 0 5px;
                    border-radius: 5px !important;
                }
                .page-item.active .page-link {
                    background-color: var(--primary-color);
                    border-color: var(--primary-color);
                    color: white;
                }
                .nav-pills .nav-link {
                    color: var(--primary-color);
                    border: 1px solid #dee2e6;
                }
                .nav-pills .nav-link:hover {
                    background-color: rgba(var(--primary-color-rgb), 0.1);
                }
                `}
            </style>
        </div>
    );
};

export default ProductSpecs;
