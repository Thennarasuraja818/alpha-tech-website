import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, clearCart, updateQuantity } from "../../redux/cartSlice";
import apiCart from "../../apiProvider/addToCartApi";

const CartPage = () => {
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [apiCartData, setApiCartData] = useState({
        subtotal: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCartDetails();
    }, []);

    const handleQuantityChange = async (productCartId, newQty) => {
        if (newQty >= 1) {
            // Update local state immediately for better UX
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productCartId ? { ...item, quantity: parseInt(newQty) } : item
                )
            );

            // Call API to update quantity on server
            try {
                const token = localStorage.getItem('userToken');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const guestId = localStorage.getItem('guestUserId');

                if (token && user._id) {
                    // Update cart on server
                    await apiCart.updateCartQuantity(user._id, productCartId, newQty);
                } else if (guestId) {
                    await apiCart.updateCartQuantity(guestId, productCartId, newQty);
                }

                // Refresh cart to get updated totals
                await getCartDetails();
            } catch (error) {
                console.error("Error updating quantity:", error);
                // Revert on error
                await getCartDetails();
            }
        }
    };

    const handleRemoveItem = async (productId, offer) => {
        try {
            if (!cartId) {
                console.error("Cart ID not found");
                return;
            }
            const result = await apiCart.deleteCart(cartId, productId, offer);
            if (result.status) {
                // Refresh cart after removal
                await getCartDetails();
                dispatch(removeFromCart(productId));
            } else {
                console.error("Failed to remove item:", result.response);
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const getCartDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const guestId = localStorage.getItem('guestUserId');

            let result;
            if (token && user._id) {
                result = await apiCart.getCart(user._id, { type: 'user', userType: 'user' });
            } else if (guestId) {
                result = await apiCart.getCart(guestId, { type: 'guest', userType: 'guest' });
            }

            console.log("Cart API Response:", result?.response?.data);

            // Handle the API response and map to cart items format
            // API returns an array, get the first cart object
            if (result && result.response?.data && result.response.data.length > 0) {
                const apiData = result.response.data[0]; // Get first cart object from array
                setCartId(apiData._id);

                // Map the products array to cart items format
                const mappedItems = apiData.products.map((product) => ({
                    id: product.productCartId || product._id,
                    productId: product._id,
                    name: product.productName,
                    partNo: product.attributes?.variantName || 'N/A',
                    totalAmount: product.totalAmount,
                    mrpPrice: product.mrpPrice,
                    quantity: product.quantity,
                    image: product.productImage && product.productImage.length > 0
                        ? (product.productImage[0].url || product.productImage[0])
                        : "/img/product-seal-1.png",
                    offerAmount: product.offerAmount || 0,
                    offerType: product.offerType || 'no',
                }));

                setCartItems(mappedItems);

                // Set cart summary data
                setApiCartData({
                    subtotal: apiData.subtotal || 0,
                    total: apiData.total || 0
                });
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart details:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="cart-page-wrapper" style={{ backgroundColor: '#e8e4dc', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
                <div className="container text-center py-5">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper" style={{ backgroundColor: '#e8e4dc', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container" style={{ maxWidth: '1400px' }}>
                {/* Page Title */}
                <div className="text-center mb-5 pt-4">
                    <h1 className="shopping-bag-title">SHOPPING BAG</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="bi bi-cart3 opacity-25" style={{ fontSize: '5rem' }}></i>
                        </div>
                        <h3 className="fw-bold text-dark mb-3">Your cart is empty</h3>
                        <p className="text-muted mb-4">Looks like you haven't added any products yet.</p>
                        <Link to="/products" className="btn btn-dark px-5 py-3 text-uppercase fw-bold">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Left Column: Cart Items Table */}
                        <div className="col-lg-8">
                            <div className="cart-table-wrapper bg-white" style={{ padding: '20px 24px', borderRadius: "8px" }}>
                                {/* Table Header */}
                                <div className="table-header d-flex align-items-center pb-3 mb-2" style={{ borderBottom: '2px solid #333' }}>
                                    <div style={{ width: '35%', paddingLeft: '80px' }}>
                                        <span className="text-uppercase fw-semibold" style={{ fontSize: '13px', letterSpacing: '1.2px', color: '#000' }}>PRODUCT</span>
                                    </div>
                                    <div style={{ width: '15%', textAlign: 'center' }}>
                                        <span className="text-uppercase fw-semibold" style={{ fontSize: '13px', letterSpacing: '1.2px', color: '#000' }}>UNIT PRICE</span>
                                    </div>
                                    <div style={{ width: '18%', textAlign: 'center' }}>
                                        <span className="text-uppercase fw-semibold" style={{ fontSize: '13px', letterSpacing: '1.2px', color: '#000' }}>QUANTITY</span>
                                    </div>
                                    <div style={{ width: '17%', textAlign: 'center' }}>
                                        <span className="text-uppercase fw-semibold" style={{ fontSize: '13px', letterSpacing: '1.2px', color: '#000' }}>TOTAL</span>
                                    </div>
                                    <div style={{ width: '15%', textAlign: 'center' }}>
                                        <span className="text-uppercase fw-semibold" style={{ fontSize: '13px', letterSpacing: '1.2px', color: '#000' }}>ACTION</span>
                                    </div>
                                </div>

                                {/* Cart Items */}
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item-row d-flex align-items-center" style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
                                        {/* Product Image and Name */}
                                        <div className="d-flex align-items-center" style={{ width: '35%' }}>
                                            <div className="product-image-wrapper bg-white me-3" style={{ width: '70px', height: '70px', border: '1px solid #e0e0e0', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h6 className="mb-1 fw-medium" style={{ fontSize: '14px', fontWeight: '500', color: '#222', lineHeight: '1.4' }}>
                                                    {item.name}
                                                </h6>
                                                <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                                                    {item.partNo}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Unit Price */}
                                        <div style={{ width: '35%', textAlign: 'center' }}>
                                            <div>
                                                <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
                                                    ₹{item.mrpPrice}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div style={{ width: '15%', textAlign: 'center' }}>
                                            <div className="modern-quantity-selector">
                                                <button
                                                    className={`quantity-btn ${item.quantity <= 1 ? 'disabled' : ''}`}
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="quantity-value">{item.quantity}</span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div style={{ width: '17%', textAlign: 'center' }}>
                                            <span className="fw-semibold" style={{ fontSize: '15px', color: '#000' }}>
                                                ₹{item.totalAmount}
                                            </span>
                                        </div>

                                        {/* Remove Action */}
                                        <div style={{ width: '25%', textAlign: 'center' }}>
                                            <button
                                                className="btn btn-link text-uppercase"
                                                onClick={() => handleRemoveItem(item.id, item.offerType)}
                                                style={{
                                                    fontSize: '12px',
                                                    letterSpacing: '0.5px',
                                                    textDecoration: 'none',
                                                    color: '#dc3545',
                                                    fontWeight: '500',
                                                    padding: '5px 10px',
                                                    borderRadius: '3px',
                                                    transition: 'all 0.2s ease',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="col-lg-4">
                            <div className="order-summary-wrapper bg-white sticky-top" style={{ padding: '40px', top: '100px', borderRadius: '8px' }}>
                                <h5 className="text-uppercase mb-4" style={{ fontSize: '18px', letterSpacing: '2px', fontWeight: '600' }}>
                                    ORDER SUMMARY
                                </h5>

                                {/* Subtotal */}
                                <div className="d-flex justify-content-between mb-3">
                                    <span style={{ fontSize: '15px', color: '#666' }}>Subtotal</span>
                                    <span style={{ fontSize: '15px', color: '#333' }}>₹ {apiCartData.subtotal}</span>
                                </div>

                                {/* Tax (if applicable) */}
                                {apiCartData.customerTotalTax > 0 && (
                                    <div className="d-flex justify-content-between mb-3">
                                        <span style={{ fontSize: '15px', color: '#666' }}>Tax</span>
                                        <span style={{ fontSize: '15px', color: '#333' }}>₹ {apiCartData.customerTotalTax}</span>
                                    </div>
                                )}

                                {/* Shipping */}
                                <div className="d-flex justify-content-between pb-3 mb-3" style={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <span style={{ fontSize: '15px', color: '#666' }}>Shipping</span>
                                    <span style={{ fontSize: '15px', color: apiCartData.deliveryCharge === 0 ? '#27ae60' : '#333', fontWeight: '500' }}>
                                        {apiCartData.deliveryCharge === 0 ? 'Free' : `₹ ${apiCartData.deliveryCharge}`}
                                    </span>
                                </div>

                                {/* Savings (if applicable) */}
                                {apiCartData.savedAmount > 0 && (
                                    <div className="d-flex justify-content-between mb-3" style={{ color: '#27ae60' }}>
                                        <span style={{ fontSize: '15px' }}>You Save</span>
                                        <span style={{ fontSize: '15px', fontWeight: '500' }}>₹ {apiCartData.savedAmount}</span>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="d-flex justify-content-between mb-4 pb-4" style={{ borderBottom: '2px solid #333' }}>
                                    <span className="text-uppercase fw-bold" style={{ fontSize: '16px', letterSpacing: '1px' }}>TOTAL</span>
                                    <span className="fw-bold" style={{ fontSize: '18px' }}>₹ {apiCartData.total}</span>
                                </div>

                                {/* Checkout Button */}
                                <Link to="/checkout" className="btn btn-dark w-100 text-uppercase fw-bold mb-3 text-decoration-none" style={{ padding: '18px', letterSpacing: '2px', fontSize: '14px' }}>
                                    CHECKOUT
                                </Link>

                                {/* Continue Shopping Link */}
                                <Link to="/products" className="btn btn-outline-dark w-100 text-uppercase fw-medium mb-3" style={{ padding: '14px', letterSpacing: '1px', fontSize: '13px' }}>
                                    Continue Shopping
                                </Link>

                                {/* Security Note */}
                                <p className="text-center mb-0" style={{ fontSize: '12px', color: '#999' }}>
                                    Secure Checkout - SSL Encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .shopping-bag-title {
                    font-size: 48px;
                    font-weight: 600;
                    letter-spacing: 8px;
                    color: #2c2c2c;
                    margin: 0;
                    font-family: 'Playfair Display', Georgia, serif;
                }

                .cart-table-wrapper {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .order-summary-wrapper {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .cart-item-row:last-child {
                    border-bottom: none !important;
                }

                .btn-dark {
                    background-color: #2c2c2c;
                    border: none;
                    transition: background-color 0.3s ease;
                }

                .btn-dark:hover {
                    background-color: #000;
                }

                .btn-outline-dark {
                    border: 1px solid #2c2c2c;
                    color: #2c2c2c;
                    transition: all 0.3s ease;
                }

                .btn-outline-dark:hover {
                    background-color: #2c2c2c;
                    color: #fff;
                }

                .btn-link:hover {
                    color: #2c2c2c !important;
                }

                .btn-remove:hover {
                    background-color: #fee !important;
                    color: #c82333 !important;
                }

                /* Remove number input arrows */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }

                @media (max-width: 991px) {
                    .shopping-bag-title {
                        font-size: 36px;
                        letter-spacing: 4px;
                    }
                    
                    .table-header {
                        display: none !important;
                    }
                    
                    .cart-item-row {
                        flex-direction: column;
                        align-items: flex-start !important;
                        min-height: auto !important;
                    }
                    
                    .cart-item-row > div {
                        width: 100% !important;
                        text-align: left !important;
                        margin-bottom: 10px;
                    }

                    .cart-table-wrapper,
                    .order-summary-wrapper {
                        padding: 20px !important;
                    }

                    .order-summary-wrapper {
                        position: static !important;
                    }
                }
                    .modern-quantity-selector {
    display: inline-flex;
    align-items: center;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: all 0.2s ease;
}

.modern-quantity-selector:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.quantity-btn {
    padding: 8px 14px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    background: white;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1;
    outline: none;
}

.quantity-btn:not(.disabled):hover {
    background: #f7fafc;
    color: #2b6cb0;
}

.quantity-btn.disabled {
    color: #cbd5e0;
    cursor: not-allowed;
    background: #f7fafc;
}

.quantity-value {
    width: 45px;
    text-align: center;
    padding: 8px 0;
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
    background: white;
    border-left: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
}
            `}</style>
        </div>
    );
};

export default CartPage;