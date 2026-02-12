import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, clearCart, updateQuantity } from "../../redux/cartSlice";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const dispatch = useDispatch();

    const handleQuantityChange = (id, newQty) => {
        if (newQty >= 1) {
            dispatch(updateQuantity({ id, quantity: parseInt(newQty) }));
        }
    };

    return (
        <div className="cart-page pb-5" style={{ marginTop: '80px', backgroundColor: '#f8f9fa', minHeight: '80vh' }}>
            <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
                <div className="container">
                    <h1 className="h3 fw-bold mb-0 text-primary">Shopping Cart</h1>
                    <p className="text-muted mb-0 small">Review your items before requesting a quote.</p>
                </div>
            </div>

            <div className="container">
                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="bi bi-cart3  opacity-25" style={{ fontSize: '5rem' }}></i>
                        </div>
                        <h3 className="fw-bold text-dark mb-3">Your cart is empty</h3>
                        <p className="text-muted mb-4">Looks like you haven't added any products for inquiry yet.</p>
                        <Link to="/products" className="btn btn-primary px-4 py-2 fw-bold text-white shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
                            Start Browsing
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Left Column: Cart Items */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
                                <div className="card-header bg-white py-3 px-4 fw-bold border-bottom">
                                    Inquiry Items <span className="badge bg-light text-dark ms-2 border">{cartItems.length}</span>
                                </div>
                                <div className="list-group list-group-flush">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="list-group-item p-4 d-flex align-items-center gap-4 hover-bg-light transition-all">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0 bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', border: '1px solid #eee' }}>
                                                <img
                                                    src={item.image || "/img/product-seal-1.png"}
                                                    alt={item.name}
                                                    className="img-fluid"
                                                    style={{ maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-grow-1">
                                                <Link to={`/products`} className="text-decoration-none text-dark hover-text-primary">
                                                    <h6 className="fw-bold mb-1">{item.name.replace(` - ${item.partNo}`, '')}</h6>
                                                </Link>
                                                <p className="mb-0 text-muted small font-monospace">Part No: <span className="fw-bold text-dark">{item.partNo}</span></p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center border-secondary-subtle"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                    style={{ width: '70px' }}
                                                />
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                className="btn btn-link text-danger p-2 rounded-circle hover-bg-danger-subtle"
                                                onClick={() => dispatch(removeFromCart(item.id))}
                                                title="Remove Item"
                                            >
                                                <i className="bi bi-trash fs-5"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-end">
                                <button className="btn btn-link text-muted text-decoration-none small" onClick={() => dispatch(clearCart())}>
                                    <i className="bi bi-x-circle me-1"></i> Clear Selection
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Summary */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 sticky-top text-center" style={{ top: '100px' }}>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4 text-start">Order Summary</h5>

                                    <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                                        <span className="text-muted">Total Products:</span>
                                        <span className="fw-bold">{cartItems.length}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="text-muted">Total Quantity:</span>
                                        <span className="fw-bold text-primary fs-5">{totalQuantity}</span>
                                    </div>

                                    <div className="alert alert-light border small text-start mb-4">
                                        <div className="d-flex">
                                            <i className="bi bi-info-circle text-primary me-2 mt-1"></i>
                                            <div>
                                                By proceeding, you are requesting a quote. No payment is required at this stage.
                                            </div>
                                        </div>
                                    </div>

                                    <button className="btn w-100 py-3 mb-3 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                                        Request Quote <i className="bi bi-arrow-right ms-2"></i>
                                    </button>

                                    <Link to="/products" className="btn btn-outline-secondary w-100 border-0 fw-medium">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .hover-bg-light:hover {
                    background-color: #f8f9fa;
                }
                .hover-text-primary:hover {
                    color: var(--primary-color) !important;
                }
                .hover-bg-danger-subtle:hover {
                    background-color: #fee2e2;
                }
                .quantity-control .btn:focus {
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
};

export default CartPage;
