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
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
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
        fetchSubCategories();
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

    const fetchSubCategories = async () => {
        try {
            const response = await HomeApi.subCategoryList()
            if (response.status) {
                const data = response.response;
                console.log("response: ", data)
                if (data?.data?.items && Array.isArray(data?.data?.items)) {
                    setSubCategoryList(data?.data?.items);
                } else {
                    console.error("Subcategories API returned non-array:", data?.data?.items);
                    setSubCategoryList([]);
                }
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setSubCategoryList([]);
        }
    }

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
                            className="nav-item dropdown position-static"
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

                            {/* Desktop Mega Menu with Dynamic API Data */}
                            <div className={`dropdown-menu mega-menu ${showMegaMenu ? 'show' : ''}`} style={{ left: '50%', transform: 'translateX(-50%)', width: '90%', padding: '20px' }}>
                                <div className="row">
                                    {categoryList.map((category) => {
                                        // Filter subcategories for this category
                                        const categorySubCategories = subCategoryList.filter(sub => {
                                            // Check if sub.category array contains the current category
                                            return sub.category && Array.isArray(sub.category) && sub.category.some(cat => cat._id === category._id);
                                        });

                                        // Only render if there are subcategories or if you want to show empty categories too
                                        return (
                                            <div className="col-md-4 mb-4" key={category._id}>
                                                <h6 className="text-uppercase border-bottom pb-2 mb-3 fw-bold text-primary">
                                                    {category.name}
                                                </h6>
                                                <ul className="list-unstyled">
                                                    {categorySubCategories.length > 0 ? (
                                                        categorySubCategories.map((sub) => (
                                                            <li key={sub._id} className="mb-2">
                                                                <Link
                                                                    to={`/products/${sub._id}`}
                                                                    state={{ subCategoryName: sub.name }}
                                                                    className="text-decoration-none text-dark hover-primary"
                                                                    onClick={closeMenus}
                                                                    style={{ transition: 'color 0.2s' }}
                                                                    onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'}
                                                                    onMouseOut={(e) => e.target.style.color = ''}
                                                                >
                                                                    {sub.name} {/* Assuming API returns subCategoryName */}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-muted small">No subcategories available</li>
                                                    )}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                    {categoryList.length === 0 && <p className="text-center text-muted">Loading categories...</p>}
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
                    </ul>

                    {/* 3. Right: Icons */}
                    <div className="d-flex align-items-center gap-4">
                        {/* Search Icon */}
                        <div className="search-icon-wrapper" style={{ cursor: 'pointer' }} onClick={() => setShowSearch(!showSearch)}>
                            <i className={`bi ${showSearch ? 'bi-x-lg' : 'bi-search'} fs-5`} style={{ color: 'var(--primary-color)' }}></i>
                        </div>
                        {/* Cart */}
                        <div className="cart-wrapper position-relative" style={{ cursor: 'pointer' }} onClick={() => navigate('/cart')}>
                            <i className="bi bi-cart3 fs-4" style={{ color: 'var(--primary-color)' }}></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                {cartCount}
                            </span>
                        </div>

                        {/* Login */}
                        {isAuthenticated ? (
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
                        )}
                    </div>
                </div>
            </div>
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
`}
            </style>

        </nav>
    );
}

export default Header;