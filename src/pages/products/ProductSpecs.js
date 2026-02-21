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


// Detect if product has O-ring standard data
const isOringProduct = (product) =>
    (product?.as_568a_standard?.length > 0) ||
    (product?.jis_b_2401_standard?.length > 0);


// Build O-ring spec rows from product
const buildOringSpecs = (product) => {
    const rows = [];
    (product?.as_568a_standard || []).forEach((s, i) =>
        rows.push({
            uniqueId: `as-${s.sku}-${i}`,
            standard: "AS 568A",
            partNo: s.sizeCode,
            id: s.metric_id_mm,
            idTolerance: s.metric_id_tolerance_mm,
            cs: s.metric_cs_mm,
            csTolerance: s.metric_cs_tolerance_mm,
            sku: s.sku,
            price: Number(s.price || 0),
            // stock: Number(s.stock || 0),
            // weight: s.weight || "",
            customermrp: s.customermrp || "",
        })
    );
    (product?.jis_b_2401_standard || []).forEach((s, i) =>
        rows.push({
            uniqueId: `jis-${s.sku}-${i}`,
            standard: "JIS B 2401",
            partNo: s.sizeCode,
            id: s.metric_id_mm,
            idTolerance: s.metric_id_tolerance_mm,
            cs: s.metric_cs_mm,
            csTolerance: s.metric_cs_tolerance_mm,
            sku: s.sku,
            price: Number(s.price || 0),
            // stock: Number(s.stock || 0),
            // weight: s.weight || "",
            customermrp: s.customermrp || "",
        })
    );
    return rows;
};


// Build dynamic variant rows from customerAttribute.rowData
// Returns: { columns: [{key, label}], rows: [...] }
const buildVariantData = (product) => {
    const rowData = product?.customerAttribute?.rowData || [];
    if (!rowData.length) return { columns: [], rows: [] };

    const COMMON_KEYS = ["price", "stock", "sku", "customermrp", "mrp"];
    const firstRow = rowData[0];
    const extraKeys = Object.keys(firstRow).filter((k) => !COMMON_KEYS.includes(k));

    const columns = [
        ...extraKeys.map((k) => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1) })),
        { key: "sku", label: "SKU" },
        { key: "price", label: "Price" },
    ];

    const rows = rowData.map((row, i) => ({ ...row, uniqueId: `variant-${i}` }));
    return { columns, rows };
};




const ProductSpecs = () => {
    const { subCategoryId, variantId: childCategoryId } = useParams();
    const [loading, setLoading] = useState(true);
    const [specs, setSpecs] = useState([]);
    const [variantData, setVariantData] = useState(null); // Store full variant data
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [quantities, setQuantities] = useState({});
    const [productList, setProductList] = useState([])
    const [heroProduct, setHeroProduct] = useState(null);

    const dispatch = useDispatch();
    const { translateSync } = useTranslation();

    const [oringSpecs, setOringSpecs] = useState([]);   // O-ring rows
    const [variantCols, setVariantCols] = useState([]);   // dynamic columns
    const [variantRows, setVariantRows] = useState([]);   // dynamic rows
    const [productType, setProductType] = useState("oring");


    const ITEMS_PER_PAGE = 10;
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
                    // const standards = [
                    //     ...(hero.as_568a_standard || []),
                    //     ...(hero.jis_b_2401_standard || [])
                    // ];

                    // const formattedSpecs = standards.map((std, index) => ({
                    //     uniqueId: `${std.sku}-${index}`,

                    //     partNo: std.sizeCode,
                    //     id: std.metric_id_mm,
                    //     idTolerance: std.metric_id_tolerance_mm,
                    //     cs: std.metric_cs_mm,
                    //     csTolerance: std.metric_cs_tolerance_mm,
                    //     sku: std.sku,

                    //     price: Number(std.price || 0),
                    //     stock: Number(std.stock || 0),
                    // }));

                    // setSpecs(formattedSpecs);

                    if (isOringProduct(hero)) {
                        setProductType("oring");
                        setOringSpecs(buildOringSpecs(hero));
                    } else {
                        const { columns, rows } = buildVariantData(hero);
                        if (rows.length > 0) {
                            setProductType("variant");
                            setVariantCols(columns);
                            setVariantRows(rows);
                        } else {
                            setProductType("none");
                        }
                    }

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

    const activeRows = productType === "oring" ? oringSpecs : variantRows;


    const filteredRows = activeRows.filter((row) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return Object.values(row).some((v) =>
            v && String(v).toLowerCase().includes(term)
        );
    });


    const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
    const indexOfFirst = (currentPage - 1) * ITEMS_PER_PAGE;
    const indexOfLast = indexOfFirst + ITEMS_PER_PAGE;
    const currentRows = filteredRows.slice(indexOfFirst, indexOfLast);

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
    // const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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

        const price = Number(item.customermrp || item.price || 0);
        const totalPrice = price * qty;

        // Calculate variant name (use last extra attribute value for generic variants)
        let name = item.partNo || item.sku || "item";
        if (productType === "variant") {
            const attrKeys = variantCols.filter(c => !["price", "stock", "sku", "customermrp", "mrp", "weight"].includes(c.key));
            if (attrKeys.length > 0) {
                name = item[attrKeys[attrKeys.length - 1].key] || name;
            }
        }

        // Guest/User ID logic
        const token = localStorage.getItem('userToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const guestId = getOrGenerateGuestId();

        const variantInfo =
            productType === "oring"
                ? {
                    variantName: item.partNo,
                    id: item.id,
                    idTolerance: item.idTolerance,
                    cs: item.cs,
                    csTolerance: item.csTolerance,
                    standard: item.standard,
                    sku: item.sku,
                }
                : {
                    variantName: name,
                    sku: item.sku,
                    ...Object.fromEntries(
                        variantCols
                            .filter((c) => !["price", "stock", "sku", "customermrp", "mrp"].includes(c.key))
                            .map((c) => [c.key, item[c.key] || ""])
                    ),
                };

        let payload = {
            products: [{ productId: heroProduct?._id, quantity: qty, mrpPrice: price, ...variantInfo }],
            //  [
            //     {
            //         productId: heroProduct?._id, // Using root product ID
            //         variantName: item.partNo,
            //         id: item.id,
            //         idTolerance: item.idTolerance,
            //         cs: item.cs,
            //         csTolerance: item.csTolerance,
            //         sku: item.sku,
            //         quantity: qty,
            //         mrpPrice: price,
            //     }
            // ],
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
            if (result && result.status) {
                toast.success(`Added ${qty} x ${name} to cart!`);
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


            } else {
                toast.error(result?.response || 'Failed to add to cart');
            }
        } catch (error) {
            console.error("Add to cart error", error);
            toast.error('An error occurred while adding to cart.');
        }
    };

    return (
        <div className="product-specs-page pb-5" style={{ marginTop: "100px", backgroundColor: "#f8f9fa", minHeight: "80vh" }}>
            <div className="container">

                {/* ── Hero Card ─────────────────────────────────────────────────── */}
                <div className="card border-0 shadow-lg mb-5 overflow-hidden rounded-4">
                    <div className="row g-0">
                        <div className="col-lg-5 bg-white d-flex align-items-center justify-content-center p-5 position-relative">
                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                                style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                            <img
                                src={heroProduct?.productImage?.[0]
                                    ? `${IMAGE_URL}${heroProduct.productImage[0].docPath}/${heroProduct.productImage[0].docName}`
                                    : "/img/product-seal-1.png"}
                                alt={heroProduct?.productName}
                                className="img-fluid position-relative z-1 hover-scale"
                                style={{ maxHeight: "350px", objectFit: "contain", filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))" }}
                            />
                        </div>
                        <div className="col-lg-7" style={{ background: "linear-gradient(135deg, var(--primary-color) 0%, #1a1a2e 100%)" }}>
                            <div className="card-body p-5 d-flex flex-column h-100 justify-content-center text-white">
                                <h1 className="fw-bold mb-3 display-5 text-white">{heroProduct?.productName || "Product"}</h1>
                                <div className="d-flex align-items-center mb-4 flex-wrap gap-2">
                                    <span className="badge px-3 py-2 rounded-pill bg-white text-primary fw-bold shadow-sm">
                                        <i className="bi bi-gear-fill me-2"></i>Industrial Grade
                                    </span>
                                    <span className="badge px-3 py-2 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: "var(--accent-color)", color: "white" }}>
                                        <i className="bi bi-check-circle-fill me-2"></i>In Stock
                                    </span>
                                    {/* Show product type badge */}
                                    {productType === "oring" && (
                                        <span className="badge px-3 py-2 rounded-pill fw-bold shadow-sm bg-info text-dark">
                                            <i className="bi bi-circle me-2"></i>O-Ring Standards
                                        </span>
                                    )}
                                </div>
                                <div className="mb-4" style={{ height: "4px", width: "80px", backgroundColor: "var(--accent-color)", borderRadius: "2px" }}></div>
                                <p className="lead mb-4 text-white-50" style={{ maxWidth: "600px" }}>
                                    {heroProduct?.description || heroProduct?.shortDescription || "Product description not available"}
                                </p>
                                <div className="row g-3 mt-auto">
                                    {[
                                        { icon: "bi-shield-check", label: "Quality", value: "ISO 9001:2015" },
                                        { icon: "bi-box-seam", label: "Orders", value: "Bulk & Retail" },
                                        { icon: "bi-truck", label: "Shipping", value: "Fast Delivery" },
                                    ].map(({ icon, label, value }) => (
                                        <div key={label} className="col-md-4">
                                            <div className="d-flex align-items-center p-3 rounded-3 h-100 feature-box"
                                                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(5px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <i className={`bi ${icon} fs-3 text-white me-3 opacity-75`}></i>
                                                <div>
                                                    <small className="d-block text-white-50 fw-bold text-uppercase" style={{ fontSize: "0.7rem" }}>{label}</small>
                                                    <span className="fw-bold">{value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                    </div>
                )}

                {/* No Variants */}
                {!loading && productType === "none" && (
                    <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                        <i className="bi bi-box-seam display-4 text-muted mb-3 d-block opacity-50"></i>
                        <h5 className="text-muted">No size variants available for this product.</h5>
                        <p className="text-muted small">Contact us for bulk pricing or custom orders.</p>
                    </div>
                )}

                {!loading && productType !== "none" && (
                    <>
                        {/* ── Search Bar ──────────────────────────────────────────────── */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-6">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0 ps-3"><i className="bi bi-search text-muted"></i></span>
                                            <input type="text" className="form-control border-start-0"
                                                placeholder="Search variants..."
                                                value={searchTerm}
                                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-md-end text-muted small">
                                        Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredRows.length)} of {filteredRows.length} results
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Table ───────────────────────────────────────────────────── */}
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 custom-specs-table">

                                    {/* ── O-ring Table Head ── */}
                                    {productType === "oring" && (
                                        <thead className="small text-uppercase fw-bold" style={{ backgroundColor: "var(--primary-color)" }}>
                                            <tr>
                                                {[
                                                    "Standard", "Part No.", "ID (mm)", "±", "CS (mm)", "±",
                                                    "SKU", "Price", "Qty", "Action"
                                                ].map((h) => (
                                                    <th key={h} className="py-3 px-3 text-white" style={{ backgroundColor: "var(--primary-color)", whiteSpace: "nowrap" }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                    )}

                                    {/* ── Dynamic Variant Table Head ── */}
                                    {productType === "variant" && (
                                        <thead className="small text-uppercase fw-bold" style={{ backgroundColor: "var(--primary-color)" }}>
                                            <tr>
                                                <th className="py-3 px-3 text-white" style={{ backgroundColor: "var(--primary-color)" }}>#</th>
                                                {variantCols.map((col) => (
                                                    <th key={col.key} className="py-3 px-3 text-white" style={{ backgroundColor: "var(--primary-color)", whiteSpace: "nowrap" }}>
                                                        {col.label}
                                                    </th>
                                                ))}
                                                <th className="py-3 px-3 text-white text-center" style={{ backgroundColor: "var(--primary-color)", width: "90px" }}>Qty</th>
                                                <th className="py-3 px-3 text-white text-center" style={{ backgroundColor: "var(--primary-color)" }}>Action</th>
                                            </tr>
                                        </thead>
                                    )}

                                    <tbody>
                                        {currentRows.length > 0 ? (
                                            currentRows.map((item, rowIdx) => (
                                                <tr key={item.uniqueId}>

                                                    {/* ── O-ring Row ── */}
                                                    {productType === "oring" && (
                                                        <>
                                                            <td>
                                                                <span className={`badge rounded-pill px-2 py-1 ${item.standard === "AS 568A" ? "bg-primary" : "bg-success"}`} style={{ fontSize: "10px" }}>
                                                                    {item.standard}
                                                                </span>
                                                            </td>
                                                            <td className="fw-bold font-monospace" style={{ color: "var(--primary-color)" }}>{item.partNo}</td>
                                                            <td>{item.id}</td>
                                                            <td><span className="badge bg-light text-dark border fw-medium px-2 py-1 rounded-pill">{item.idTolerance}</span></td>
                                                            <td>{item.cs}</td>
                                                            <td><span className="badge bg-light text-dark border fw-medium px-2 py-1 rounded-pill">{item.csTolerance}</span></td>
                                                            <td className="text-muted small font-monospace">{item.sku}</td>
                                                            {/* <td className="text-muted small">{item.weight || "—"}</td> */}
                                                            <td className="fw-semibold" style={{ color: "var(--primary-color)" }}>
                                                                {item.customermrp ? `₹${item.customermrp}` : (item.price ? `₹${item.price}` : "—")}
                                                            </td>
                                                        </>
                                                    )}

                                                    {/* ── Dynamic Variant Row ── */}
                                                    {productType === "variant" && (
                                                        <>
                                                            <td className="text-muted small ps-3">{indexOfFirst + rowIdx + 1}</td>
                                                            {variantCols.map((col) => (
                                                                <td key={col.key}>
                                                                    {col.key === "customermrp" || col.key === "price" ? (
                                                                        <span className="fw-semibold" style={{ color: "var(--primary-color)" }}>
                                                                            {(item.customermrp || item.price) ? `₹${item.customermrp || item.price}` : "—"}
                                                                        </span>
                                                                    )
                                                                        //  : col.key === "stock" ? (
                                                                        //     <span className={`badge rounded-pill px-2 py-1 ${Number(item[col.key]) > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                                                                        //         {item[col.key] || 0}
                                                                        //     </span>
                                                                        // )
                                                                        : col.key === "sku" ? (
                                                                            <span className="text-muted small font-monospace">{item[col.key] || "—"}</span>
                                                                        ) : (
                                                                            <span>{item[col.key] || "—"}</span>
                                                                        )}
                                                                </td>
                                                            ))}
                                                        </>
                                                    )}

                                                    {/* Qty input — both types */}
                                                    <td className="d-flex justify-content-center ">
                                                        <input type="number" className="form-control form-control-sm text-center border-secondary-subtle"
                                                            min="1" value={quantities[item.uniqueId] || 1}
                                                            onChange={(e) => handleQuantityChange(item.uniqueId, e.target.value)}
                                                            style={{ width: "70px" }} />
                                                    </td>

                                                    {/* Add to Cart — both types */}
                                                    <td className="pe-4 text-center">
                                                        <button className="btn btn-primary btn-sm px-3 py-2 shadow-sm d-flex align-items-center mx-auto"
                                                            onClick={() => handleAddToCart(item)}>
                                                            <i className="bi bi-cart-plus me-2"></i>Add to Cart
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="20" className="text-center py-5 text-muted">
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
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style>{`
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
        .feature-box { transition: all 0.3s ease; }
        .feature-box:hover { background: rgba(255,255,255,0.2) !important; transform: translateY(-2px); }
        .custom-specs-table tbody tr { transition: background-color 0.2s ease; }
        .custom-specs-table tbody tr:hover td { background-color: #f8fafc; }
        .page-link { color: var(--primary-color); border: none; margin: 0 5px; border-radius: 5px !important; }
        .page-item.active .page-link { background-color: var(--primary-color); border-color: var(--primary-color); color: white; }
      `}</style>
        </div>
    );
};

export default ProductSpecs;
