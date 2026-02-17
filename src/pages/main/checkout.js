import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSearchParams, useNavigate } from "react-router-dom";

// import apiProvider from "../../apiProvider/categoryApi";
// import ApiProvider from "../../apiProvider/addToCartApi"
import getApi from "../../apiProvider/api"
import CheckoutApiProvider from "../../apiProvider/checkoutApi";
import { Country, State, City } from 'country-state-city';
import { IMAGE_URL } from "../../network/apiClient";
import { useTranslation } from "../../context/TranslationContext";

import './myaccount.css';
import apiProvider from "../../apiProvider/api";
import apiCart from "../../apiProvider/addToCartApi";
import { toast } from "react-toastify";

const radioStyles = `
  .payment-radio-native {
    position: absolute !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    pointer-events: none !important;
    z-index: -1 !important;
  }
  .custom-radio-circle {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #c5cdd8;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-right: 12px;
    cursor: pointer;
  }
  .custom-radio-circle.active {
    border-color: #007bff;
    background: #007bff;
  }
  .custom-radio-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ffffff;
    transition: all 0.2s ease;
    transform: scale(0);
    opacity: 0;
  }
  .custom-radio-circle.active .custom-radio-dot {
    transform: scale(1);
    opacity: 1;
  }
`;

const CustomRadio = ({ id, name, value, checked, onChange }) => (
    <div style={{ display: 'inline-flex', position: 'relative', alignItems: 'center' }}>
        <input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        />
        <div style={{
            flexShrink: 0,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: checked ? '2px solid #007bff' : '2px solid #c5cdd8',
            background: checked ? '#007bff' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            transition: 'all 0.2s ease'
        }}>
            <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#fff',
                transform: checked ? 'scale(1)' : 'scale(0)',
                transition: 'transform 0.15s ease'
            }} />
        </div>
    </div>
);
const countryList = Country.getAllCountries();

const CheckoutSchema = Yup.object().shape({
    selectedAddress: Yup.string().required('Please select a delivery address'),
    paymentMethod: Yup.string().required("Please select a payment method"),
});

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

const CheckoutPage = () => {
    const countryList = Country.getAllCountries();
    const navigate = useNavigate();
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();
    const user = useSelector((state) => state.auth.user);
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    console.error("type :", searchParams.get("type"))
    const [userDetails, setUserDetails] = useState([])
    const courseDatas = useSelector((state) => state.training);
    const [courseDetails, setCourseDetails] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [currencys, setCurrencys] = useState([]);
    const [transectionCurrecy, settransectionCurrecy] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [countries, setCountries] = useState(Country.getAllCountries());
    const [states, setStates] = useState([]);

    const [cartListDetails, setCartListDetails] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");


    const getCartDetails = async () => {
        const token = localStorage.getItem('userToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const guestId = localStorage.getItem('guestUserId');

        let result;
        if (token && user._id) {
            result = await apiCart.getCart(user._id, { type: 'user', userType: 'user' });
        } else if (guestId) {
            result = await apiCart.getCart(guestId, { type: 'guest', userType: 'guest' });
        }
        if (result && result.response && result.response.data) {
            const { products, total } = result.response.data[0];
            console.error(products, "products");
            console.error(total, "total");
            setCartListDetails(products);
            setTotalPrice(total);
        }
    };


    useEffect(() => {
        getCartDetails()
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const result = await apiProvider.getAddress(user?._id, 'customer');
            console.error("result :", result.response?.data);
            if (result && result.status) {
                setAddresses(result.response?.data);

                // If nothing selected yet, select the first one
                if (!selectedAddressId && result.response.data.length > 0) {
                    setSelectedAddressId(result.response.data[0]._id);
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }

    const handleCloseAddressModal = () => {
        setShowAddressModal(false);
    };

    const handleAddressSubmit = async (values, { resetForm }) => {
        try {
            const selectedCountry = countries.find(c => c.isoCode === values.country);
            const countryName = selectedCountry ? selectedCountry.name : '';
            const selectedState = states.find(s => s.isoCode === values.state);
            const stateName = selectedState ? selectedState.name : '';

            const payload = {
                userId: user?._id || user?.id,
                label: values.label.toUpperCase(),
                contactName: values.name,
                contactNumber: values.mobile.replace(/^0+/, ''),
                addressLine: values.streetAddress,
                city: values.city,
                state: stateName,
                country: countryName,
                postalCode: values.postalCode
            };

            const result = await apiProvider.addAddress(payload);
            if (result && result.status) {
                toast.success("Address added successfully!");
                resetForm();
                setShowAddressModal(false);
                fetchAddresses(); // Refresh list
            }
        } catch (error) {
            console.error("Error adding address:", error);
            toast.error("Failed to add address");
        }
    };

    const formSubmit = async (values) => {
        console.error("Submitting order:", values);

        // Get selected address details
        const selectedAddress = addresses.find(addr => addr._id === values.selectedAddress);

        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        try {
            const orderData = {
                placedBy: user?._id,
                placedByModel: 'User',

                // Shipping address
                shippingAddress: {
                    street: selectedAddress.addressLine || '',
                    city: selectedAddress.city || '',
                    state: selectedAddress.state || '',
                    postalCode: selectedAddress.postalCode || '',
                    country: selectedAddress.country || '',
                    contactName: selectedAddress.contactName || '',
                    contactNumber: selectedAddress.contactNumber || ''
                },

                // Cart items
                items: cartListDetails.map(item => ({
                    productId: item.productId || item._id,
                    quantity: item.quantity || 1,
                    unitPrice: item.mrpPrice,
                    attributes: item.attributes || {},
                    offerId: item.offerId || null,
                    offerType: item.offerType || 'no',
                    discount: item.discount || 0,
                    taxRate: item.taxRate || 0
                })),

                // Payment & pricing
                totalAmount: totalPrice,
                paymentMode: values.paymentMethod,
                paymentStatus: 'pending',
                deliveryCharge: 0,
                discount: 0,

                // Optional fields
                orderType: type === 'buynow' ? 'instant' : 'cart',
                paymentDetails: {
                    method: values.paymentMethod,
                    timestamp: new Date()
                }
            };

            console.error("Sending order data:", orderData);

            // ✅ Call backend API
            const result = await CheckoutApiProvider.checkout(orderData);

            if (result && result.status) {
                toast.success("Order placed successfully!");

                // Clear cart
                setCartListDetails([]);
                setTotalPrice(0);

                // Redirect to success page or orders page
                setTimeout(() => {
                    navigate('/pageaccount?tab=orders');
                }, 1500);
            } else {
                toast.error(result?.message || "Failed to place order");
            }

        } catch (error) {
            console.error("Order submission error:", error);
            toast.error("An error occurred while placing the order");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <style>{radioStyles}</style>
            <div>
                <section className="Home-banner-3 text-white  position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center home-header">
                            <div className="innerbanner-txt">
                                <h1 className="fw-bold text-center color-white display-5 font-51">{translateSync('Checkout')}</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5">
                    <div className="checkout_area bg-color-white py-5">
                        <div className="container">
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    selectedAddress: selectedAddressId || '',
                                    paymentMethod: '',
                                    acceptTerms: false
                                }}
                                validationSchema={CheckoutSchema}
                                onSubmit={values => {
                                    formSubmit(values);
                                }}
                            >
                                {({ errors, touched, values, setFieldValue, handleChange, handleBlur, isValid, dirty }) => (
                                    <Form onSubmit={(e) => {
                                        e.preventDefault();
                                    }}>
                                        <div className="row g-4">
                                            {/* Left Side - Address (Wider) */}
                                            <div className="col-lg-7 col-xl-8">
                                                {/* Checkout Information Header */}
                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <h3 className="text-danger mb-0" style={{ fontSize: '24px', fontWeight: '600' }}>
                                                        {translateSync('Checkout Information')}
                                                    </h3>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger px-4 py-2"
                                                        onClick={() => setShowAddressModal(true)}
                                                        style={{
                                                            borderRadius: '8px',
                                                            fontWeight: '500',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        {translateSync('Add New Address')}
                                                    </button>
                                                </div>

                                                {/* Select Delivery Address */}
                                                <div className="mb-4">
                                                    <h5 className="mb-3" style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
                                                        {translateSync('Select Delivery Address')}
                                                    </h5>

                                                    {errors.selectedAddress && touched.selectedAddress && (
                                                        <div className="alert alert-danger py-2" role="alert">
                                                            {errors.selectedAddress}
                                                        </div>
                                                    )}

                                                    {addresses && addresses.length > 0 ? (
                                                        <div className="addresses-list">
                                                            {addresses.map((address) => (
                                                                <div
                                                                    key={address._id}
                                                                    onClick={() => setFieldValue('selectedAddress', address._id)}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        marginBottom: '12px',
                                                                        borderRadius: '12px',
                                                                        border: values.selectedAddress === address._id
                                                                            ? '2px solid #007bff'
                                                                            : '2px solid #e8ecf0',
                                                                        background: values.selectedAddress === address._id
                                                                            ? '#f0f7ff'
                                                                            : '#ffffff',
                                                                        boxShadow: values.selectedAddress === address._id
                                                                            ? '0 2px 12px rgba(0,123,255,0.12)'
                                                                            : '0 1px 4px rgba(0,0,0,0.05)',
                                                                        transition: 'all 0.2s ease'
                                                                    }}
                                                                >
                                                                    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px' }}>
                                                                        <CustomRadio
                                                                            id={`address_${address._id}`}
                                                                            name="selectedAddress"
                                                                            value={address._id}
                                                                            checked={values.selectedAddress === address._id}
                                                                            onChange={() => setFieldValue('selectedAddress', address._id)}
                                                                        />
                                                                        <div style={{ flex: 1 }}>
                                                                            {/* Label badge */}
                                                                            {address.label && (
                                                                                <span style={{
                                                                                    display: 'inline-block',
                                                                                    fontSize: '11px',
                                                                                    fontWeight: '600',
                                                                                    color: '#007bff',
                                                                                    background: '#e8f0fe',
                                                                                    borderRadius: '4px',
                                                                                    padding: '2px 8px',
                                                                                    marginBottom: '6px',
                                                                                    letterSpacing: '0.5px'
                                                                                }}>
                                                                                    {address.label}
                                                                                </span>
                                                                            )}
                                                                            {/* Name & Phone */}
                                                                            <div style={{ marginBottom: '4px' }}>
                                                                                <strong style={{ fontSize: '15px', color: '#2c3e50' }}>
                                                                                    {address.contactName || 'N/A'}
                                                                                </strong>
                                                                                <span style={{ color: '#6c757d', marginLeft: '8px', fontSize: '14px' }}>
                                                                                    {address.contactNumber || ''}
                                                                                </span>
                                                                            </div>
                                                                            {/* Address line */}
                                                                            <p style={{ margin: '0 0 2px', color: '#495057', fontSize: '13px', lineHeight: '1.5' }}>
                                                                                {address.addressLine || 'N/A'}
                                                                            </p>
                                                                            {/* City, State, Country */}
                                                                            <p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>
                                                                                {[address.city, address.state, address.country].filter(Boolean).join(', ')}
                                                                                {address.postalCode ? ` - ${address.postalCode}` : ''}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="alert alert-info">
                                                            {translateSync('No saved addresses. Please add a new address.')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Side - Payment Method & Order Summary (Narrower) */}
                                            <div className="col-lg-5 col-xl-4">
                                                {/* Payment Method */}
                                                <div className="mb-4">
                                                    <div className="d-flex flex-column align-items-center gap-2 mb-3">
                                                        <h5 className="mb-0" style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                                                            {translateSync('Payment Method')}
                                                        </h5>
                                                        <h4 className="mb-0" style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50' }}>
                                                            {translateSync('Choose Payment')}
                                                        </h4>
                                                    </div>

                                                    {errors.paymentMethod && touched.paymentMethod && (
                                                        <div className="alert alert-danger py-2" role="alert">
                                                            {errors.paymentMethod}
                                                        </div>
                                                    )}

                                                    <div className="payment-methods-new">
                                                        {/* Cash on Delivery */}
                                                        <div
                                                            className={`payment-method-card-new mb-3 ${values.paymentMethod === "Cash on Delivery" ? 'selected' : ''
                                                                }`}
                                                            onClick={() => setFieldValue('paymentMethod', 'Cash on Delivery')}
                                                        >
                                                            <div className="d-flex align-items-center p-3">
                                                                {/* <input
                                                                    type="radio"
                                                                    id="payment_cod"
                                                                    name="paymentMethod"
                                                                    value="Cash on Delivery"
                                                                    checked={values.paymentMethod === "Cash on Delivery"}
                                                                    onChange={handleChange}
                                                                    className="me-3"
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                        accentColor: '#007bff'
                                                                    }}
                                                                /> */}
                                                                <CustomRadio
                                                                    id="payment_cod"
                                                                    name="paymentMethod"
                                                                    value="Cash on Delivery"
                                                                    checked={values.paymentMethod === "Cash on Delivery"}
                                                                    onChange={() => setFieldValue('paymentMethod', 'Cash on Delivery')}
                                                                />
                                                                <label htmlFor="payment_cod" className="mb-0" style={{
                                                                    fontSize: '15px',
                                                                    color: '#2c3e50',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {translateSync('Cash on delivery')}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Credit/Debit Card */}
                                                        <div
                                                            className={`payment-method-card-new mb-3 ${values.paymentMethod === "Credit/Debit Card" ? 'selected' : ''
                                                                }`}
                                                            onClick={() => setFieldValue('paymentMethod', 'Credit/Debit Card')}
                                                        >
                                                            <div className="d-flex align-items-center p-3">
                                                                <CustomRadio
                                                                    id="payment_card"
                                                                    name="paymentMethod"
                                                                    value="Credit/Debit Card"
                                                                    checked={values.paymentMethod === "Credit/Debit Card"}
                                                                    onChange={() => setFieldValue('paymentMethod', 'Credit/Debit Card')}
                                                                />
                                                                <label htmlFor="payment_card" className="mb-0" style={{
                                                                    fontSize: '15px',
                                                                    color: '#2c3e50',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {translateSync('Credit/Debit Card')}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Google Pay */}
                                                        <div
                                                            className={`payment-method-card-new mb-3 ${values.paymentMethod === "Google Pay" ? 'selected' : ''
                                                                }`}
                                                            onClick={() => setFieldValue('paymentMethod', 'Google Pay')}
                                                        >
                                                            <div className="d-flex align-items-center p-3">
                                                                <CustomRadio
                                                                    id="payment_gpay"
                                                                    name="paymentMethod"
                                                                    value="Google Pay"
                                                                    checked={values.paymentMethod === "Google Pay"}
                                                                    onChange={() => setFieldValue('paymentMethod', 'Google Pay')}
                                                                />
                                                                <label htmlFor="payment_gpay" className="mb-0" style={{
                                                                    fontSize: '15px',
                                                                    color: '#2c3e50',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {translateSync('Google Pay')}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* PhonePe */}
                                                        <div
                                                            className={`payment-method-card-new mb-3 ${values.paymentMethod === "PhonePe" ? 'selected' : ''
                                                                }`}
                                                            onClick={() => setFieldValue('paymentMethod', 'PhonePe')}
                                                        >
                                                            <div className="d-flex align-items-center p-3">
                                                                <CustomRadio
                                                                    id="payment_phonepe"
                                                                    name="paymentMethod"
                                                                    value="PhonePe"
                                                                    checked={values.paymentMethod === "PhonePe"}
                                                                    onChange={() => setFieldValue('paymentMethod', 'PhonePe')}
                                                                />
                                                                <label htmlFor="payment_phonepe" className="mb-0" style={{
                                                                    fontSize: '15px',
                                                                    color: '#2c3e50',
                                                                    cursor: 'pointer',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {translateSync('PhonePe')}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Dynamic Payment Methods from API */}
                                                        {paymentMethods && paymentMethods.length > 0 &&
                                                            paymentMethods.map((ival, index) => {
                                                                const inputId = `payment_${ival.methodName.toLowerCase().replace(/\s+/g, '_')}_${index}`;
                                                                return (
                                                                    <div
                                                                        key={inputId}
                                                                        className={`payment-method-card-new mb-3 ${values.paymentMethod === ival.methodName ? 'selected' : ''
                                                                            }`}
                                                                        onClick={() => setFieldValue('paymentMethod', ival.methodName)}
                                                                    >
                                                                        <div className="d-flex align-items-center p-3">
                                                                            <CustomRadio
                                                                                id={inputId}
                                                                                name="paymentMethod"
                                                                                value={ival.methodName}
                                                                                checked={values.paymentMethod === ival.methodName}
                                                                                onChange={() => setFieldValue('paymentMethod', ival.methodName)}
                                                                            />
                                                                            <label htmlFor={inputId} className="mb-0 d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                                                                <img
                                                                                    src={IMAGE_URL + ival.methodImage}
                                                                                    alt={ival.methodName}
                                                                                    style={{ height: "25px", marginRight: "8px" }}
                                                                                />
                                                                                <span style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>
                                                                                    {translateSync(ival.methodName)}
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>

                                                {/* Order Summary */}
                                                <div className="order-summary-new" style={{
                                                    position: 'sticky',
                                                    top: '20px'
                                                }}>
                                                    <h5 className="mb-3" style={{
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        color: '#d32f2f'
                                                    }}>
                                                        {translateSync('Order Summary')}
                                                    </h5>

                                                    <div className="summary-content p-3" style={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <div className="d-flex justify-content-between mb-2 pt-2">
                                                            <span style={{ fontSize: '13px', color: '#6c757d' }}>
                                                                {translateSync('Subtotal')}
                                                            </span>
                                                            <span style={{ fontSize: '13px', color: '#6c757d' }}>
                                                                ₹ {totalPrice ? totalPrice : 0}
                                                            </span>
                                                        </div>

                                                        <div className="d-flex justify-content-between pt-3 border-top" style={{ marginTop: '10px' }}>
                                                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#2c3e50' }}>
                                                                {translateSync('Total')}
                                                            </span>
                                                            <span style={{ fontSize: '15px', fontWeight: '700', color: '#2c3e50' }}>
                                                                ₹ {totalPrice ? totalPrice : 0}
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-danger w-100 mt-4 py-2"
                                                            onClick={() => {
                                                                if (transectionCurrecy?.currencyName !== "AED") {
                                                                    if (isValid && dirty) {
                                                                        formSubmit(values)
                                                                    }
                                                                }
                                                            }}
                                                            style={{
                                                                borderRadius: '8px',
                                                                fontSize: '15px',
                                                                fontWeight: '600',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}
                                                        >
                                                            {translateSync('Place Order')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </section>

                {/* Policy Modal */}
                <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} id="policyModal" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white" style={{ backgroundImage: 'linear-gradient(to left, #17c1aa, #582d86, #17c1aa, #5d368f)' }}>
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ whiteSpace: 'pre-line', maxHeight: '60vh', overflowY: 'auto' }}>
                                {modalContent.split('\n').map((paragraph, index) => (
                                    <p key={index} className={paragraph.startsWith('#') ? 'h4 mt-3' : paragraph.startsWith('-') ? 'mb-1' : 'mb-3'}>
                                        {translateSync(paragraph)}
                                    </p>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ backgroundImage: 'linear-gradient(to left, #17c1aa, #582d86, #17c1aa, #5d368f)' }}
                                    onClick={() => setShowModal(false)}
                                >
                                    {translateSync('Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Backdrop */}
                {showModal && (
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowModal(false)}
                    ></div>
                )}

                {/* Add Address Modal */}
                {showAddressModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '700px' }}>
                            <div className="modal-content">
                                <div className="modal-header border-bottom-0 pb-0">
                                    <h5 className="modal-title fw-bold">Add New Address</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseAddressModal}></button>
                                </div>
                                <div className="modal-body">
                                    <Formik
                                        initialValues={{
                                            label: '',
                                            name: '',
                                            mobile: '',
                                            streetAddress: '',
                                            city: '',
                                            country: '',
                                            state: '',
                                            postalCode: ''
                                        }}
                                        validationSchema={addressSchema}
                                        onSubmit={handleAddressSubmit}
                                    >
                                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                                            <Form>
                                                <div className="row g-3">
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
                                                                    setFieldValue('state', '');
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
                                                        className="btn btn-danger px-4 py-2 fw-medium"
                                                    >
                                                        Submit
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
            </div>
        </>
    )
}

export default CheckoutPage;





