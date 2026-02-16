import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "../../context/TranslationContext";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Country, State, City } from 'country-state-city';

import apiProvider from "../../apiProvider/api";

const addressSchema = Yup.object().shape({
    label: Yup.string().required('Label is required'),
    name: Yup.string().required('Name is required'),
    mobile: Yup.string().required('Mobile is required'),
    streetAddress: Yup.string().required('Street Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal Code is required'),
});

const PageAccount = () => {
    const { translateSync } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('dashboard');
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const userName = user?.name || 'Thennarasu Raja';
    const [addresses, setAddresses] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    // Address Modal State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null); // Add this
    const [isEditMode, setIsEditMode] = useState(false);
    const [countries, setCountries] = useState(Country.getAllCountries());
    console.error("countries", countries)
    const [states, setStates] = useState([]);


    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAddresses()
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('userToken');
        toast.success("Logged out successfully!");
        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    const handleCloseAddressModal = () => {
        setShowAddressModal(false);
        setEditingAddress(null);
        setIsEditMode(false);
    };
    const handleShowAddressModal = () => {
        setIsEditMode(false);
        setEditingAddress(null);
        setShowAddressModal(true);
    };

    const handleEditAddress = (address) => {
        setIsEditMode(true);
        setEditingAddress(address);

        // Set states based on country
        const country = countries.find(c => c.name === address.country);
        if (country) {
            const countryStates = State.getStatesOfCountry(country.isoCode);
            setStates(countryStates);
        }

        setShowAddressModal(true);
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const result = await apiProvider.deleteAddress(addressId);
            if (result && result.status) {
                toast.success("Address deleted successfully!");
                fetchAddresses();
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Failed to delete address");
        }
    };

    const handleAddressSubmit = async (values, { resetForm }) => {
        try {
            // Get country name from isoCode
            const selectedCountry = countries.find(c => c.isoCode === values.country);
            const countryName = selectedCountry ? selectedCountry.name : '';

            // Get state name from isoCode
            const selectedState = states.find(s => s.isoCode === values.state);
            const stateName = selectedState ? selectedState.name : '';


            const payload = {
                userId: user?._id || user?.id,
                label: values.label.toUpperCase(), // WORK
                contactName: values.name,
                contactNumber: values.mobile.replace(/^0+/, ''), // remove leading 0
                addressLine: values.streetAddress,
                city: values.city,
                state: stateName,        // ✅ Store state NAME instead of code
                country: countryName,
                postalCode: values.postalCode
            };

            const result = await apiProvider.addAddress(payload);
            console.error("result :", result);
            if (result && result.status) {
                toast.success("Address added successfully!");
                resetForm();
                setShowAddressModal(false);
                // Optionally refresh address list here
            }
            fetchAddresses();
        } catch (error) {
            console.error("Error adding address:", error);
            //   toast.error("An error occurred.");
        }
    };

    const handleAddressUpdate = async (values, { resetForm }) => {
        try {
            // Get country name from isoCode
            const selectedCountry = countries.find(c => c.isoCode === values.country);
            const countryName = selectedCountry ? selectedCountry.name : '';

            // Get state name from isoCode
            const selectedState = states.find(s => s.isoCode === values.state);
            const stateName = selectedState ? selectedState.name : '';

            const payload = {
                userId: user?._id || user?.id,
                label: values.label.toUpperCase(), // WORK
                contactName: values.name,
                contactNumber: values.mobile.replace(/^0+/, ''), // remove leading 0
                addressLine: values.streetAddress,
                city: values.city,
                state: stateName,        // ✅ Store state NAME instead of code
                country: countryName,
                postalCode: values.postalCode
            };

            const result = await apiProvider.updateAddress(values.id, payload);
            console.error("result :", result);
            if (result && result.status) {
                toast.success("Address updated successfully!");
                resetForm();
                setShowAddressModal(false);
                // Optionally refresh address list here
            }
            fetchAddresses();
        } catch (error) {
            console.error("Error updating address:", error);
            //   toast.error("An error occurred.");
        }
    };

    const fetchAddresses = async () => {
        try {
            const result = await apiProvider.getAddress(user?._id, 'customer');
            console.error("result :", result.response?.data);
            if (result && result.status) {
                setAddresses(result.response?.data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }

    // Dashboard Content
    const renderDashboard = () => (
        <div className="dashboard-content">
            <div className="welcome-section mb-4 pb-3 border-bottom">
                <h2 className="fw-bold mb-2" style={{ color: '#1e293b' }}>
                    Hello {userName}!
                </h2>
                <p className="text-muted fs-6 mb-0">
                    Welcome back to your account dashboard
                </p>
            </div>

            <div className="dashboard-description bg-light p-4 rounded-3 mb-4">
                <p className="fs-5 mb-0">
                    From your account dashboard, you can easily check & view your{" "}
                    <span className="text-primary fw-semibold">
                        recent orders
                    </span>
                    , manage your{" "}
                    <span className="text-primary fw-semibold">
                        shipping and billing addresses
                    </span>{" "}
                    and edit your{" "}
                    <span className="text-primary fw-semibold">
                        password and account details
                    </span>
                    .
                </p>
            </div>

            <div className="row g-4 mt-2">
                <div className="col-md-6">
                    <div className="stat-card bg-white p-4 rounded-3 shadow-sm">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-2">Total Orders</h6>
                                <h3 className="fw-bold mb-0">24</h3>
                                <small className="text-success">
                                    <i className="bi bi-arrow-up me-1"></i>+3 this month
                                </small>
                            </div>
                            <div className="stat-icon bg-primary bg-opacity-10 p-3 rounded-circle">
                                <i className="bi bi-cart-check fs-3 text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="stat-card bg-white p-4 rounded-3 shadow-sm">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-2">Active Orders</h6>
                                <h3 className="fw-bold mb-0">2</h3>
                                <small className="text-warning">
                                    <i className="bi bi-clock me-1"></i>In progress
                                </small>
                            </div>
                            <div className="stat-icon bg-warning bg-opacity-10 p-3 rounded-circle">
                                <i className="bi bi-truck fs-3 text-warning"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Orders Content
    const renderOrders = () => (
        <div className="orders-content">
            <h3 className="fw-bold mb-4 pb-2 border-bottom">My Orders</h3>
            <div className="table-responsive bg-white rounded-3 shadow-sm">
                <table className="table table-hover mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-3 fw-medium">#ORD-001</td>
                            <td className="px-4 py-3 text-muted">Feb 10, 2026</td>
                            <td className="px-4 py-3">
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                    Delivered
                                </span>
                            </td>
                            <td className="px-4 py-3 fw-medium">$125.00</td>
                            <td className="px-4 py-3">
                                <button className="btn btn-sm btn-outline-primary">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 fw-medium">#ORD-002</td>
                            <td className="px-4 py-3 text-muted">Feb 08, 2026</td>
                            <td className="px-4 py-3">
                                <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                                    Processing
                                </span>
                            </td>
                            <td className="px-4 py-3 fw-medium">$89.50</td>
                            <td className="px-4 py-3">
                                <button className="btn btn-sm btn-outline-primary">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 fw-medium">#ORD-003</td>
                            <td className="px-4 py-3 text-muted">Feb 05, 2026</td>
                            <td className="px-4 py-3">
                                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                    Shipped
                                </span>
                            </td>
                            <td className="px-4 py-3 fw-medium">$234.99</td>
                            <td className="px-4 py-3">
                                <button className="btn btn-sm btn-outline-primary">Track</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Returns Content
    const renderReturns = () => (
        <div className="returns-content">
            <h3 className="fw-bold mb-4 pb-2 border-bottom">Returns & Refunds</h3>
            <div className="bg-light p-4 rounded-3 mb-4">
                <p className="mb-0">You have no active return requests.</p>
            </div>
            <div className="bg-white p-4 rounded-3 shadow-sm">
                <h5 className="fw-bold mb-3">Request a Return</h5>
                <form>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Order ID</label>
                        <input type="text" className="form-control" placeholder="Enter your order ID" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Reason for Return</label>
                        <select className="form-select">
                            <option>Select a reason</option>
                            <option>Damaged product</option>
                            <option>Wrong item received</option>
                            <option>Not satisfied</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <button className="btn btn-primary">Submit Request</button>
                </form>
            </div>
        </div>
    );

    // Track Your Order Content
    const renderTrackOrder = () => (
        <div className="track-order-content">
            <h3 className="fw-bold mb-4 pb-2 border-bottom">Track Your Order</h3>
            <div className="bg-white p-5 rounded-3 shadow-sm text-center">
                <div className="mb-4">
                    <i className="bi bi-truck fs-1 text-primary opacity-50"></i>
                </div>
                <p className="text-muted mb-4">
                    To track your order please enter your Order ID in the box below and press "Track" button.
                    This was given to you on your receipt and in the confirmation email you should have received.
                </p>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-light">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Order ID (e.g. ORD-001)"
                            />
                            <button className="btn btn-primary px-4">Track</button>
                        </div>
                        <small className="text-muted">
                            Found in your order confirmation email
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );

    // My Address Content
    const renderAddress = () => (
        <div className="address-content">
            <h3 className="fw-bold mb-4 pb-2 border-bottom">My Address</h3>
            <div className="row g-4">
                {addresses.length === 0 ? (
                    <p className="text-muted">No addresses found.</p>
                ) : (
                    addresses.map((address, index) => (
                        <div className="col-md-6" key={address._id}>
                            <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">
                                        <i className="bi bi-map me-2 text-primary"></i>
                                        Address #{index + 1} ({address.label})
                                    </h5>

                                    {address.isDefault && (
                                        <span className="badge bg-primary">Default</span>
                                    )}
                                </div>

                                <p className="mb-1 fw-bold">{address.contactName}</p>
                                <p className="mb-1 text-muted">{address.addressLine}</p>
                                <p className="mb-1 text-muted">
                                    {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="mb-3 text-muted">{address.country}</p>

                                <p className="mb-0">
                                    <i className="bi bi-telephone me-2"></i>
                                    +91 {address.contactNumber}
                                </p>

                                <div className="mt-3">
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEditAddress(address)}
                                    >
                                        Edit
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteAddress(address._id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4">
                <button className="btn btn-primary" onClick={handleShowAddressModal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Address
                </button>
            </div>
        </div>
    );

    // Account Details Content
    const renderAccountDetails = () => (
        <div className="account-details-content">
            <h3 className="fw-bold mb-4 pb-2 border-bottom">Account Details</h3>
            <div className="bg-white p-4 rounded-3 shadow-sm">
                <form>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-medium">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue="Thennarasu"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-medium">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue="Raja"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            defaultValue="thennarasu@example.com"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            defaultValue="+91 98765 43210"
                        />
                    </div>

                    <button className="btn btn-primary px-4">Save Changes</button>
                </form>
            </div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>My Account | Alpha Technical Rubber Products</title>
                <meta name="description" content="Manage your account, orders, and addresses" />
            </Helmet>

            <section className="py-5 mt-10 bg-light min-vh-100 d-flex align-items-start">
                <div className="container">
                    <div className="row g-4">
                        {/* LEFT SIDEBAR - FULL HEIGHT */}
                        <div className="col-md-4 col-lg-3">
                            <div className="sticky-sidebar" style={{ position: 'sticky', top: '100px' }}>
                                <div className="user-profile-card bg-white p-3 rounded-3 shadow-sm mb-2">
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="profile-icon bg-primary bg-opacity-10 p-3 rounded-circle">
                                            <i className="bi bi-person-circle fs-3 text-primary"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">{userName}</h6>
                                            <small className="text-muted">Member since Jan 2026</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="list-group shadow-sm rounded-3 overflow-hidden">
                                    <button
                                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'dashboard' ? 'active bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab('dashboard')}
                                    >
                                        <i className={`bi bi-sliders me-3 fs-5 ${activeTab === 'dashboard' ? 'text-white' : 'text-primary'}`}></i>
                                        Dashboard
                                    </button>

                                    <button
                                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'orders' ? 'active bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        <i className={`bi bi-bag me-3 fs-5 ${activeTab === 'orders' ? 'text-white' : 'text-primary'}`}></i>
                                        Orders
                                    </button>

                                    <button
                                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'returns' ? 'active bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab('returns')}
                                    >
                                        <i className={`bi bi-arrow-return-left me-3 fs-5 ${activeTab === 'returns' ? 'text-white' : 'text-primary'}`}></i>
                                        Returns
                                    </button>

                                    <button
                                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'track' ? 'active bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab('track')}
                                    >
                                        <i className={`bi bi-truck me-3 fs-5 ${activeTab === 'track' ? 'text-white' : 'text-primary'}`}></i>
                                        Track Your Order
                                    </button>

                                    <button
                                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'address' ? 'active bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab('address')}
                                    >
                                        <i className={`bi bi-geo-alt me-3 fs-5 ${activeTab === 'address' ? 'text-white' : 'text-primary'}`}></i>
                                        My Address
                                    </button>

                                    <button
                                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${activeTab === 'account' ? 'active bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab('account')}
                                    >
                                        <i className={`bi bi-person me-3 fs-5 ${activeTab === 'account' ? 'text-white' : 'text-primary'}`}></i>
                                        Account Details
                                    </button>

                                    <button
                                        className="list-group-item list-group-item-action d-flex align-items-center py-3 text-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-3 fs-5 text-danger"></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT - DYNAMIC BASED ON ACTIVE TAB */}
                        <div className="col-md-8 col-lg-9">
                            <div className="bg-white p-4 p-lg-5 shadow-sm rounded-3 min-vh-75">
                                {activeTab === 'dashboard' && renderDashboard()}
                                {activeTab === 'orders' && renderOrders()}
                                {activeTab === 'returns' && renderReturns()}
                                {activeTab === 'track' && renderTrackOrder()}
                                {activeTab === 'address' && renderAddress()}
                                {activeTab === 'account' && renderAccountDetails()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '700px' }}>
                        <div className="modal-content">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {isEditMode ? 'Edit Address' : 'Add Address'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseAddressModal}></button>
                            </div>
                            <div className="modal-body">
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        id: editingAddress?._id || '',
                                        label: editingAddress?.label || '',
                                        name: editingAddress?.contactName || '',
                                        mobile: editingAddress?.contactNumber || '',
                                        streetAddress: editingAddress?.addressLine || '',
                                        city: editingAddress?.city || '',
                                        country: editingAddress?.country
                                            ? countries.find(c => c.name === editingAddress.country)?.isoCode || ''
                                            : '',
                                        state: editingAddress?.state
                                            ? states.find(s => s.name === editingAddress.state)?.isoCode || ''
                                            : '',
                                        postalCode: editingAddress?.postalCode || ''
                                    }}
                                    validationSchema={addressSchema}
                                    onSubmit={isEditMode ? handleAddressUpdate : handleAddressSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                                        <Form>
                                            <div className="row g-3">
                                                <Field type="hidden" name="id" />
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <Field
                                                            as="select"
                                                            name="label"
                                                            className={`form-select ${touched.label && errors.label ? 'is-invalid' : ''}`}
                                                        >
                                                            <option value="">Select Label</option>
                                                            <option value="Home">Home</option>
                                                            <option value="Work">Work</option>
                                                            <option value="Other">Other</option>
                                                        </Field>

                                                        <label>Select Label *</label>

                                                        {touched.label && errors.label && (
                                                            <div className="invalid-feedback">{errors.label}</div>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <Field name="name" className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`} placeholder="Name" />
                                                        <label>Name *</label>
                                                        {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <Field name="mobile" className={`form-control ${touched.mobile && errors.mobile ? 'is-invalid' : ''}`} placeholder="Mobile" />
                                                        <label>Mobile *</label>
                                                        {touched.mobile && errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <Field name="streetAddress" className={`form-control ${touched.streetAddress && errors.streetAddress ? 'is-invalid' : ''}`} placeholder="Street Address" />
                                                        <label>Street Address *</label>
                                                        {touched.streetAddress && errors.streetAddress && <div className="invalid-feedback">{errors.streetAddress}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <Field name="city" className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''}`} placeholder="City" />
                                                        <label>City *</label>
                                                        {touched.city && errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <select
                                                            name="country"
                                                            className={`form-select ${touched.country && errors.country ? 'is-invalid' : ''}`}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                const countryCode = e.target.value;
                                                                setStates(State.getStatesOfCountry(countryCode));
                                                                setFieldValue('state', ''); // Reset state when country changes
                                                            }}
                                                            onBlur={handleBlur}
                                                            value={values.country}
                                                        >
                                                            <option value="">Select Country</option>
                                                            {countries.map((country) => (
                                                                <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                                            ))}
                                                        </select>
                                                        <label>Select Country *</label>
                                                        {touched.country && errors.country && <div className="invalid-feedback">{errors.country}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <select
                                                            name="state"
                                                            className={`form-select ${touched.state && errors.state ? 'is-invalid' : ''}`}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.state}
                                                            disabled={!values.country}
                                                        >
                                                            <option value="">Select State</option>
                                                            {states.map((state) => (
                                                                <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                                            ))}
                                                        </select>
                                                        <label>Select State *</label>
                                                        {touched.state && errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <Field name="postalCode" className={`form-control ${touched.postalCode && errors.postalCode ? 'is-invalid' : ''}`} placeholder="Postal Code" />
                                                        <label>Postal Code *</label>
                                                        {touched.postalCode && errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary px-4 py-2 fw-medium"
                                                    style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                                                >
                                                    {isEditMode ? 'Update' : 'Submit'}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={2000} />

            <style jsx>{`
                .min-vh-75 {
                    min-height: 78vh;
                }
                .list-group-item.active {
                    background-color: var(--primary-color, #0d6efd) !important;
                    border-color: var(--primary-color, #0d6efd) !important;
                }
                .list-group-item {
                    border-left: none;
                    border-right: none;
                    border-radius: 0 !important;
                    transition: all 0.2s ease;
                }
                .list-group-item:first-child {
                    border-top: none;
                    border-left-width: 0;
                     border-right-width: 0;
                }
                .list-group-item:last-child {
                    border-bottom: none;
                     border-left-width: 0;
                     border-right-width: 0;
                }
                .list-group-item:hover:not(.active) {
                    background-color: #f8f9fa;
                    transform: translateX(5px);
                }
                .stat-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
                }
                @media (max-width: 768px) {
                    .sticky-sidebar {
                        position: relative !important;
                        top: 0 !important;
                    }
                }

                .profile-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #eef4ff; /* soft light background */
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-icon i {
    font-size: 20px;
    color: var(--primary-color);
}
                
                /* Modal Styles */
                .modal.show {
                    display: block;
                    padding-right: 17px;
                }
                .form-floating > .form-control:focus,
                .form-floating > .form-select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Adjust based on primary color */
                }
                 .form-floating > label {
                    color: #6c757d;
                }
            `}</style>
        </>
    );
};

export default PageAccount;