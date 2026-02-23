import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "../../context/TranslationContext";
import HomeApi from "../../apiProvider/homeApi";
import { IMAGE_URL } from "../../network/apiClient";
import { logout } from "../../redux/authSlice";
import { setCartCount } from "../../redux/cartSlice";
import apiCart from "../../apiProvider/addToCartApi";

const Header = () => {
    const { translateSync } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector((state) => state.auth.token);
    console.log("isAuthenticated", isAuthenticated)

    // State
    const [scrolled, setScrolled] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const dispatch = useDispatch();
    const cartCount = useSelector((state) => state.cart.totalQuantity);

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchCategories();
        getCartCount();
    }, [isAuthenticated]);

    const fetchCategories = async () => {
        try {
            const response = await HomeApi.categoryList()
            if (response.status) {
                const data = response.response;
                if (Array.isArray(data)) {
                    setCategoryList(data);
                } else if (data && Array.isArray(data.data)) {
                    setCategoryList(data.data);
                } else {
                    console.error("Categories API returned non-array:", data);
                    setCategoryList([]);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategoryList([]);
        }
    };

    const getCartCount = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const guestId = localStorage.getItem('guestUserId');

            let result;
            if (token && user._id) {
                result = await apiCart.getCartCount(user._id, { type: 'user', userType: 'user' });
            } else if (guestId) {
                result = await apiCart.getCartCount(guestId, { type: 'guest', userType: 'guest' });
            }

            console.error("Cart Count API Response:", result?.response?.data);
            dispatch(setCartCount(result?.response?.data?.count || 0))

        } catch (error) {
            console.error("Error fetching cart details:", error);
        }
    };



    const navbarClasses = `navbar navbar-expand-lg fixed-top industrial-navbar ${scrolled ? 'shadow-sm' : ''}`;

    const closeMenus = () => {
        setShowMegaMenu(false);
        setMobileMenuOpen(false);
    };

    return (
        <nav className={navbarClasses}>
            <div className="container">
                {/* 1. Left: Company Logo (PROVIDED LOGO) */}
                <NavLink className="navbar-brand" to="/">
                    <img
                        src="/img/alpha-logo.png"
                        alt="ALPHA Technical Rubber Products"
                        style={{ height: '55px', objectFit: 'contain', transform: 'scale(1.6)', transformOrigin: 'left center' }} // Fixed height, scaling properly
                    />
                </NavLink>

                {/* Mobile Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
                    {/* 2. Center: Navigation Links */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>{translateSync('Home')}</NavLink>
                        </li>

                        {/* Products Mega Menu */}
                        <li
                            className="nav-item dropdown position-relative"
                            onMouseEnter={() => setShowMegaMenu(true)}
                            onMouseLeave={() => setShowMegaMenu(false)}
                        >
                            <a
                                className={`nav-link dropdown-toggle ${location.pathname.startsWith('/products') ? 'active' : ''}`}
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                aria-expanded={showMegaMenu}
                            >
                                {translateSync('Products')}
                            </a>

                            {/* Simple Column-wise Category Dropdown */}
                            <div
                                className={`dropdown-menu border-0 shadow-sm ${showMegaMenu ? 'show' : ''}`}
                                style={{
                                    left: '0',
                                    width: '220px',
                                    padding: '8px 0',
                                    borderRadius: '8px',
                                    marginTop: '0',
                                    borderTop: '3px solid var(--primary-color) !important',
                                    visibility: showMegaMenu ? 'visible' : 'hidden',
                                    opacity: showMegaMenu ? 1 : 0,
                                    transform: showMegaMenu ? 'translateY(0)' : 'translateY(10px)',
                                    transition: 'all 0.3s ease',
                                    display: 'block',
                                    position: 'absolute',
                                    top: '100%',
                                    zIndex: 1000
                                }}
                            >
                                <div className="d-flex flex-column">
                                    {categoryList.map((category) => (
                                        <NavLink
                                            key={category._id}
                                            to={`/products/${category._id}`}
                                            className="dropdown-item py-2 px-3 d-flex align-items-center text-truncate"
                                            onClick={() => closeMenus()}
                                            style={{
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                color: '#334155',
                                                backgroundColor: 'transparent'
                                            }}
                                        >
                                            <i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: 'var(--primary-color)' }}></i>
                                            {category.name}
                                        </NavLink>
                                    ))}
                                    {categoryList.length === 0 && (
                                        <div className="px-3 py-2 text-center text-muted small">
                                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            Loading...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/applications">{translateSync('Applications')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/resources">{translateSync('Resources')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">{translateSync('About Us')}</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">{translateSync('Contact Us')}</NavLink>
                        </li>
                    </ul >

                    {/* 3. Right: Icons */}
                    < div className="d-flex align-items-center gap-4" >
                        {/* Search Icon */}
                        < div className="search-icon-wrapper" style={{ cursor: 'pointer' }} onClick={() => setShowSearch(!showSearch)}>
                            <i className={`bi ${showSearch ? 'bi-x-lg' : 'bi-search'} fs-5`} style={{ color: 'var(--primary-color)' }}></i>
                        </div >
                        {/* Cart */}
                        < div className="cart-wrapper position-relative" style={{ cursor: 'pointer' }} onClick={() => navigate('/cart')}>
                            <i className="bi bi-cart3 fs-4" style={{ color: 'var(--primary-color)' }}></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                {cartCount}
                            </span>
                        </div >

                        {/* Login */}
                        {
                            isAuthenticated ? (
                                // <NavLink className="btn btn-sm btn-industrial-outline text-dark border-dark" to="/pageaccount">{translateSync('Dashboard')}</NavLink>
                                <div className="account-wrapper position-relative">
                                    <div className="d-flex align-items-center gap-2 account-trigger" style={{ cursor: "pointer" }}>
                                        <i className="bi bi-person fs-4" style={{ color: "var(--primary-color)" }}></i>
                                        <span className="fw-medium">Account</span>
                                    </div>

                                    <div className="account-dropdown p-2">
                                        <NavLink className="dropdown-item d-flex align-items-center gap-2"
                                            to="/pageaccount">
                                            <i className="bi bi-person"></i> My Account
                                        </NavLink>

                                        <NavLink className="dropdown-item d-flex align-items-center gap-2"
                                            to="/order-tracking">
                                            <i className="bi bi-truck"></i> Order Tracking
                                        </NavLink>

                                        <NavLink className="dropdown-item d-flex align-items-center gap-2"
                                            to="/wishlist">
                                            <i className="bi bi-heart"></i> My Wishlist
                                        </NavLink>

                                        <hr className="my-2" />

                                        <button
                                            className="dropdown-item text-danger d-flex align-items-center gap-2"
                                            onClick={() => {
                                                dispatch(logout());
                                                dispatch(setCartCount(0));
                                                localStorage.removeItem("userToken");
                                                localStorage.removeItem("user");
                                                navigate("/");
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-right"></i> Logout
                                        </button>
                                    </div>
                                </div>

                            ) : (
                                <NavLink className="btn btn-sm btn-industrial-primarys" to="/login" style={{ padding: "5px 15px", backgroundColor: "var(--primary-color)", color: "white", border: "none" }}>{translateSync('Login')}</NavLink>
                            )
                        }
                    </div >
                </div >
            </div >
            <style>
                {`
.account-wrapper {
    position: relative;
}

.account-dropdown {
    position: absolute;
    top: 40px;
    right: 0;
    width: 200px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px);
    transition: all 0.2s ease;
    z-index: 1000;
}

.account-wrapper:hover .account-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.account-dropdown .dropdown-item {
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 6px;
    text-decoration: none;
    color: #333;
    transition: background 0.2s ease;
}

.account-dropdown .dropdown-item:hover {
    background-color: #f5f5f5;
}

.account-dropdown .dropdown-item i {
    font-size: 14px;
}

/* Category Mega Menu Styling */
.mega-menu {
    border-top: 4px solid var(--primary-color) !important;
    animation: fadeInMenu 0.3s ease-in-out;
}

@keyframes fadeInMenu {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.category-card {
    background-color: #ffffff;
    border: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.category-card:hover {
    background-color: #ffffff;
    border-color: rgba(30, 41, 59, 0.1);
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.category-card .category-icon-wrapper {
    transition: all 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
}

.category-card:hover .category-icon-wrapper i {
    color: #ffffff !important;
}

.category-card .category-title {
    transition: color 0.3s ease;
}

.category-card:hover .category-title {
    color: var(--primary-color) !important;
}

.category-arrow {
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    color: var(--primary-color) !important;
}

.category-card:hover .category-arrow {
    opacity: 1;
    transform: translateX(0);
}
`}
            </style>

        </nav >
    );
}

export default Header;