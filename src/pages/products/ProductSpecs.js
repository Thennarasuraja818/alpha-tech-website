import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, setCartCount } from "../../redux/cartSlice";
import productDetails from "../../data/productDetails.json";
import subcategoryVariants from "../../data/subcategoryVariants.json";
import { toast } from "react-toastify";
import { useTranslation } from "../../context/TranslationContext";
import HomeApi from "../../apiProvider/homeApi";
import apiCart from "../../apiProvider/addToCartApi";
import { BASE_URL, IMAGE_URL } from "../../network/apiClient";
import { getOrGenerateGuestId } from "../../utils/guestIdHelper";

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


                if (products.length > 0) {
                    const hero = products[0];
                    setHeroProduct(hero);

                    // Combine both standards
                    const standards = [
                        ...(hero.as_568a_standard || []),
                        ...(hero.jis_b_2401_standard || [])
                    ];

                    const formattedSpecs = standards.map((std, index) => ({
                        uniqueId: `${std.sku}-${index}`,

                        partNo: std.sizeCode,
                        id: std.metric_id_mm,
                        idTolerance: std.metric_id_tolerance_mm,
                        cs: std.metric_cs_mm,
                        csTolerance: std.metric_cs_tolerance_mm,
                        sku: std.sku,

                        price: Number(std.price || 0),
                        stock: Number(std.stock || 0),
                    }));

                    setSpecs(formattedSpecs);


                    // Sync variantData for display
                    setVariantData({
                        name: hero.productName,
                        desc: hero.description || hero.shortDescription,
                        image: hero.productImage?.[0]
                            ? `${IMAGE_URL}/${hero.productImage[0].docPath}/${hero.productImage[0].docName}`
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
            (item.cs && item.cs.toLowerCase().includes(lowerTerm)) ||
            (item.sku && item.sku.toLowerCase().includes(lowerTerm)) ||
            (item.id && String(item.id).toLowerCase().includes(lowerTerm)) ||
            (item.idTolerance && String(item.idTolerance).toLowerCase().includes(lowerTerm)) ||
            (item.csTolerance && String(item.csTolerance).toLowerCase().includes(lowerTerm))
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

    const handleAddToCart = async (item) => {
        const qty = quantities[item.uniqueId] || 1;

        const price = Number(item.price || 0);
        const totalPrice = price * qty;

        // Guest/User ID logic
        const token = localStorage.getItem('userToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const guestId = getOrGenerateGuestId();

        let payload = {
            products: [
                {
                    productId: heroProduct?._id, // Using root product ID
                    variantName: item.partNo,
                    id: item.id,
                    idTolerance: item.idTolerance,
                    cs: item.cs,
                    csTolerance: item.csTolerance,
                    sku: item.sku,
                    quantity: qty,
                    mrpPrice: price,
                }
            ],
            total: totalPrice,
            subtotal: totalPrice
        };

        if (token && user._id) {
            payload.type = 'user';
            payload.userId = user._id;
            payload.userType = 'user';
        } else {
            payload.type = 'guest';
            payload.guestUserId = guestId;
            payload.userType = 'guest';
        }

        try {
            const result = await apiCart.addToCart(payload);
            if (result && result.status && result.response) {
                // 1. Optimistic Update (Optional: keeping it for immediate feedback)
                // dispatch(addToCart({ ... })); 

                // 2. Fetch Helper: Logic to get accurate count from server
                const fetchUpdatedCount = async () => {
                    let countResult;
                    if (token && user._id) {
                        countResult = await apiCart.getCartCount(user._id, { type: 'user', userType: 'user' });
                    } else {
                        countResult = await apiCart.getCartCount(guestId, { type: 'guest', userType: 'guest' });
                    }

                    if (countResult?.status && countResult?.response?.data) {
                        dispatch(setCartCount(countResult.response.data.count || 0));
                    }
                };

                await fetchUpdatedCount();

                toast.success(`Added ${qty} x ${item.partNo} to cart!`, {
                    style: { boxShadow: 'none', border: '1px solid #e2e8f0' }
                });
            } else {
                toast.error(result?.response || 'Failed to add to cart');
            }
        } catch (error) {
            console.error("Add to cart error", error);
            toast.error('An error occurred while adding to cart.');
        }
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
                                        ? `${IMAGE_URL}${heroProduct.productImage[0].docPath}/${heroProduct.productImage[0].docName}`
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
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>ID </th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>±</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>CS</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>±</th>
                                    <th className="py-3 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>SKU</th>
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
                                            <td>
                                                <span className="badge fw-medium px-2 py-1 rounded-pill bg-light text-dark border">{item.idTolerance}</span>
                                            </td>
                                            <td>{item.cs}</td>
                                            <td>
                                                <span className="badge fw-medium px-2 py-1 rounded-pill bg-light text-dark border">
                                                    {item.csTolerance}
                                                </span>
                                            </td>
                                            <td className="text-muted small font-monospace">{item.sku}</td>
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
