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

const countryList = Country.getAllCountries();

const CheckoutSchema = Yup.object().shape({
    selectedAddress: Yup.string().required('Please select a delivery address'),
    paymentMethod: Yup.string().required("Please select a payment method"),
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

    const [cartListDetails, setCartListDetails] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");

    const policies = {
        cancellation: {
            title: "Cancellation & Refund Policy",
            content: `Last Updated: [Insert Date]
Welcome to iLap Training Academy, your trusted partner in professional training and
development across the UAE, KSA, and the wider MENA region. We value your learning
journey and aim to provide a transparent experience through clear cancellation, refund, and
terms of service guidelines.

Course Cancellation Policy
We understand that schedules change. That's why our training program cancellation policy
is designed with flexibility:

For Individual Participants:
- Cancel 7+ days before course start: Full refund or free course transfer
- Cancel 3–6 days before: 50% refund
- Cancel <3 days before: No refund

For Corporate Training & Group Bookings:
- Cancel with 14+ days' notice: Full refund
- Rescheduling accepted with 7+ days' notice, based on availability

Refund Policy for Professional Training Courses
Our refund policy is fair, fast, and clear:
- Refunds processed within 10–15 business days
- Refunds issued to the original payment method
- No refunds for:
 - No-show attendees
 - Partially attended sessions
 - Courses where more than 25% was completed

If we cancel a course, learners will receive a full refund or may choose to reschedule at no
cost.

Course Transfer Policy
Need to switch courses?
- Request a transfer 5+ days before your training start date
- Transfer allowed to any available course of equal or lesser value
- Only one free transfer per booking is permitted`
        },
        terms: {
            title: "Terms & Conditions",
            content: `iLap Terms & Conditions for Learners
1. Intellectual Property
All learning materials are copyrighted and are the intellectual property of iLap Training
Academy. Unauthorized sharing or reproduction is strictly prohibited.

2. Learner Code of Conduct
To maintain a high-quality learning environment, all learners are expected to:
- Attend sessions punctually and actively participate
- Respect trainers and fellow participants
- Maintain professional behavior during all interactions

3. Certification Eligibility
To receive a Certificate of Completion, participants must:
- Attend at least 80% of the course duration
- Complete all required assignments or assessments

4. Program Schedule & Instructor Changes
iLap Training Academy reserves the right to:
- Update course schedules, delivery formats, or locations
- Replace instructors with equally qualified professionals
- Cancel underbooked sessions with full refunds or alternative options

5. Data Privacy
We are committed to protecting your data. All personal information will be used strictly for
course communication, enrollment, and certification purposes in compliance with data
privacy laws in the UAE and GCC.`
        },
        privacy: {
            title: "Privacy Policy",
            content: `Privacy & Cookies Policy
At iLap Training Academy, we are committed to safeguarding your privacy. We collect, use,
and protect your personal data in accordance with data protection laws applicable in the
UAE, KSA, and the wider MENA region.

By using our website and services, you agree to the collection and use of your information in
accordance with this policy.

1. What Information We Collect
We may collect the following types of data:
- Personal identification information (Name, email address, phone number, etc.)
- Course registration details
- Payment and transaction history
- Browser cookies and usage data

2. How We Use Your Information
Your information helps us to:
- Register and manage your course enrollment
- Provide customer support and respond to inquiries
- Improve our content and services
- Send important updates, promotional materials, and feedback requests (only with your
consent)

3. Cookies Policy
Our website uses cookies to enhance user experience. Cookies are small data files stored on
your device to remember preferences and track usage. You can choose to disable cookies
through your browser settings, although this may affect the functionality of the site.

4. Data Security
We implement industry-standard security measures to protect your data against
unauthorized access, alteration, or disclosure.

5. Third-Party Disclosure
We do not sell or share your personal data with third parties, except as required to provide
our services or comply with legal obligations.

6. Your Rights
You have the right to:
- Access your data
- Request corrections
- Withdraw consent or request data deletion
To exercise these rights, contact us at info@ilap.me.`
        },
        contact: {
            title: "Contact Information",
            content: `Contact iLap Training Academy
Have a question about our cancellation or refund policy?
- Email: info@ilap.me
- Phone: +971 4 88 35 988 | +971 50 255 0228
- Head Office: Dubai, UAE
- Business Hours: Sunday – Thursday | 9:00 AM – 5:00 PM GST`
        }
    };

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
            }

            if (result.response.data.length > 0) {
                setSelectedAddressId(result.response.data[0]._id);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }

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

            console.log("Order response:", result);

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
                                                                    className={`address-card-new mb-3 ${values.selectedAddress === address._id ? 'selected' : ''
                                                                        }`}
                                                                    onClick={() => setFieldValue('selectedAddress', address._id)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <div className="d-flex align-items-start p-3">
                                                                        <input
                                                                            type="radio"
                                                                            name="selectedAddress"
                                                                            checked={values.selectedAddress === address._id}
                                                                            onChange={() => setFieldValue('selectedAddress', address._id)}
                                                                            className="me-3 mt-1"
                                                                            style={{
                                                                                width: '18px',
                                                                                height: '18px',
                                                                                accentColor: '#007bff'
                                                                            }}
                                                                        />
                                                                        <div className="flex-grow-1">
                                                                            <div className="mb-2">
                                                                                <strong style={{ fontSize: '16px', color: '#2c3e50' }}>
                                                                                    {address.contactName || 'N/A'}
                                                                                </strong>
                                                                                <span style={{ color: '#6c757d', marginLeft: '8px' }}>
                                                                                    | {address.contactNumber || 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                            <p className="mb-1" style={{ color: '#495057', fontSize: '14px', lineHeight: '1.6' }}>
                                                                                {address.addressLine || 'N/A'}
                                                                            </p>
                                                                            <p className="mb-0" style={{ color: '#6c757d', fontSize: '14px' }}>
                                                                                {address.country || 'India'}
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
                                                                <input
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
                                                                <input
                                                                    type="radio"
                                                                    id="payment_card"
                                                                    name="paymentMethod"
                                                                    value="Credit/Debit Card"
                                                                    checked={values.paymentMethod === "Credit/Debit Card"}
                                                                    onChange={handleChange}
                                                                    className="me-3"
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                        accentColor: '#007bff'
                                                                    }}
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
                                                                <input
                                                                    type="radio"
                                                                    id="payment_gpay"
                                                                    name="paymentMethod"
                                                                    value="Google Pay"
                                                                    checked={values.paymentMethod === "Google Pay"}
                                                                    onChange={handleChange}
                                                                    className="me-3"
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                        accentColor: '#007bff'
                                                                    }}
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
                                                                <input
                                                                    type="radio"
                                                                    id="payment_phonepe"
                                                                    name="paymentMethod"
                                                                    value="PhonePe"
                                                                    checked={values.paymentMethod === "PhonePe"}
                                                                    onChange={handleChange}
                                                                    className="me-3"
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                        accentColor: '#007bff'
                                                                    }}
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
                                                                            <input
                                                                                type="radio"
                                                                                id={inputId}
                                                                                name="paymentMethod"
                                                                                value={ival.methodName}
                                                                                checked={values.paymentMethod === ival.methodName}
                                                                                onChange={() => setFieldValue('paymentMethod', ival.methodName)}
                                                                                className="me-3"
                                                                                style={{
                                                                                    width: '18px',
                                                                                    height: '18px',
                                                                                    accentColor: '#007bff'
                                                                                }}
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
            </div>
        </>
    )
}

export default CheckoutPage;





