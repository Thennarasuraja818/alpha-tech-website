import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
// import { Country, State, City } from 'country-state-city';
import { useSearchParams, useNavigate } from "react-router-dom";

import apiProvider from "../../apiProvider/categoryApi";
import ApiProvider from "../../apiProvider/addToCartApi"
import getApi from "../../apiProvider/api"
import CheckoutApiProvider from "../../apiProvider/checkoutApi";
import { Country, State, City } from 'country-state-city';
import { IMAGE_URL } from "../../network/apiClient";
import { useTranslation } from "../../context/TranslationContext";

import './myaccount.css';

const countryList = Country.getAllCountries();

const CheckoutSchema = Yup.object().shape({
    firstName: Yup.string().required('Full name is required'),
    // lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNo: Yup.string().required('Phone no is required'),
    address1: Yup.string().required('Address is required'),
    // address2: Yup.string().required('Address is required'),
    // country: Yup.string().required("Country is required"),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // zipCode: Yup.string().required('Zip code is required'),
    paymentMethod: Yup.string().required("Please select a payment method"),

    // acceptTerms: Yup.boolean()
    //     .oneOf([true], "You must accept the terms and conditions")
    //     .required("You must accept the terms"),
});


const CheckoutPage = () => {
    const countryList = Country.getAllCountries();
    const navigate = useNavigate();
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const [userDetails, setUserDetails] = useState([])
    const courseDatas = useSelector((state) => state.training);
    const [courseDetails, setCourseDetails] = useState([])
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [currencys, setCurrencys] = useState([]);
    const [transectionCurrecy, settransectionCurrecy] = useState({});


    const [cartListDetails, setCartListDetails] = useState([])
    const [totalPrice, setTotalPrice] = useState("0")

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
• Cancel 7+ days before course start: Full refund or free course transfer
• Cancel 3–6 days before: 50% refund
• Cancel <3 days before: No refund

For Corporate Training & Group Bookings:
• Cancel with 14+ days' notice: Full refund
• Rescheduling accepted with 7+ days' notice, based on availability

Refund Policy for Professional Training Courses
Our refund policy is fair, fast, and clear:
• Refunds processed within 10–15 business days
• Refunds issued to the original payment method
• No refunds for:
 - No-show attendees
 - Partially attended sessions
 - Courses where more than 25% was completed

If we cancel a course, learners will receive a full refund or may choose to reschedule at no
cost.

Course Transfer Policy
Need to switch courses?
• Request a transfer 5+ days before your training start date
• Transfer allowed to any available course of equal or lesser value
• Only one free transfer per booking is permitted`
        },
        terms: {
            title: "Terms & Conditions",
            content: `iLap Terms & Conditions for Learners
1. Intellectual Property
All learning materials are copyrighted and are the intellectual property of iLap Training
Academy. Unauthorized sharing or reproduction is strictly prohibited.

2. Learner Code of Conduct
To maintain a high-quality learning environment, all learners are expected to:
• Attend sessions punctually and actively participate
• Respect trainers and fellow participants
• Maintain professional behavior during all interactions

3. Certification Eligibility
To receive a Certificate of Completion, participants must:
• Attend at least 80% of the course duration
• Complete all required assignments or assessments

4. Program Schedule & Instructor Changes
iLap Training Academy reserves the right to:
• Update course schedules, delivery formats, or locations
• Replace instructors with equally qualified professionals
• Cancel underbooked sessions with full refunds or alternative options

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
• Personal identification information (Name, email address, phone number, etc.)
• Course registration details
• Payment and transaction history
• Browser cookies and usage data

2. How We Use Your Information
Your information helps us to:
• Register and manage your course enrollment
• Provide customer support and respond to inquiries
• Improve our content and services
• Send important updates, promotional materials, and feedback requests (only with your
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
• Access your data
• Request corrections
• Withdraw consent or request data deletion
To exercise these rights, contact us at info@ilap.me.`
        },
        contact: {
            title: "Contact Information",
            content: `Contact iLap Training Academy
Have a question about our cancellation or refund policy?
• Email: info@ilap.me
• Phone: +971 4 88 35 988 | +971 50 255 0228
• Head Office: Dubai, UAE
• Business Hours: Sunday – Thursday | 9:00 AM – 5:00 PM GST`
        }
    };

    const openPolicyModal = (policyKey) => {
        setModalTitle(policies[policyKey].title);
        setModalContent(policies[policyKey].content);
        setShowModal(true);
    };
    useEffect(() => {
        if (courseDatas && courseDatas.isGetList) {
            getCourseDetails(courseDatas.id);
        }
    }, [courseDatas]);

    const getCourseDetails = async (id) => {
        const result = await apiProvider.getCourseDet(id);
        if (result && result.status && result.response) {
            setCourseDetails(result.response.data)
        }
    };

    const getCartDetails = async () => {
        const result = await ApiProvider.getCart();
        // console.log(result, "result-cart-user based details");
        if (result && result.response && result.response.data && result.response.data.cartDetails.length > 0) {
            setCartListDetails(result.response.data.cartDetails)
            setTotalPrice(result.response.data.totalPrice)
        }
    };

    const getPaymentMethods = async () => {
        const result = await getApi.getPaymentMethod();
        console.log(result, "result-getPaymentMethod");
        if (result && result.response && result.response.data && result.response.data) {
            setPaymentMethods(result.response.data.data)
            // setTotalPrice(result.response.data.totalPrice)
        }
    };

    const getCurrencys = async () => {
        const result = await getApi.getCurrency();
        console.log(result, "result-getCurrency");
        if (result && result.response && result.response.data && result.response.data) {
            let transecCurrency = await result.response.data.data.find(ival => ival.isTransection)
            console.log(transecCurrency);
            settransectionCurrecy(transecCurrency)
            setCurrencys(result.response.data.data)
            // setTotalPrice(result.response.data.totalPrice)
        }
    };

    useEffect(() => {
        getCartDetails()
    }, [])

    useEffect(() => {
        getPaymentMethods()
    }, [])

    useEffect(() => {
        getCurrencys()
    }, [])


    useEffect(() => {
        getUserAddressDetails(); // Fetch count on page load
    }, []);

    const getUserAddressDetails = async () => {
        try {
            const result = await ApiProvider.getUserDetails();
            console.log(result, "result--rrrr");

            if (result.status && result.response) {
                // Assuming the API returns cart items in response.data.cartDetails
                setUserDetails(result.response.data.userDetail);

            }

        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    const formSubmit = async (value) => {
        console.log("val", value)
        await getCurrencys()

        try {
            const input = {
                firstName: value.firstName,
                // lastName: value.lastName,
                email: value.email,
                phoneNo: value.phoneNo,
                address1: value.address1,
                // address2: value.address2,
                // country: value.country,
                // state: value.state,
                country: value.country,
                zipCode: value.zipCode,
                paymentMethod: value.paymentMethod,
                acceptTerms: value.acceptTerms,
                courseId: type == 'buynow' ? [courseDetails] : cartListDetails,
                amount: type == 'buynow' ? courseDetails : totalPrice,
                aedPrice: type == 'buynow' ? courseDetails.price * 3.67 : totalPrice.price * 3.67,
                type: type
            }
            const result = await CheckoutApiProvider.checkout(input)
            console.log(result,"rrrrrrrrrrrrrrrr");
            // return
            
            if (result && result.response) {
                let url = result.response.data.paymentUrl
                window.location.href = url
                // navigate("/login")
            }
        } catch (error) { }
    }


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    console.log(currencys, "currencys");
    console.log(transectionCurrecy, "transectionCurrecy");
    // console.log(totalPrice, "totalPrice");




    return (
        <>
            <div>
                <section className="Home-banner-3  text-white py-5 position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center  home-header" >
                            <div className="innerbanner-txt ">
                                <h1 className="fw-bold text-center display-5  font-51">{translateSync('Checkout')}</h1>
                                {/* <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.html" title="" itemprop="url">About</a></li>
                                    <li class="breadcrumb-item active">Our Facilitators</li>
                                </ol> */}
                            </div>

                        </div>

                    </div>
                </section>

                <section className="py-5">
                    <div className="checkout_area bg-color-white rbt-section-gap py-5">
                        <div className="container">
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    firstName: userDetails.name || "",
                                    email: userDetails.email || '',
                                    phoneNo: userDetails.phoneNo || '',
                                    address1: userDetails.address || '',
                                    zipCode: userDetails.postalCode || '',
                                    country: userDetails.country || '',
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
                                        if (transectionCurrecy.currencyName === "AED") {
                                            if (values.acceptTerms && isValid && dirty) {
                                                formSubmit(values);
                                            }
                                        } else {
                                            if (isValid && dirty) {
                                                formSubmit(values);
                                            }
                                        }
                                    }}>
                                        <div className="row g-5">
                                            <div className="col-lg-7">
                                                <div className="checkout-content-wrapper">
                                                    <div id="billing-form">
                                                        <h4 className="checkout-title">{translateSync('Billing Address')}</h4>
                                                        <div className="row">
                                                            <div className="col-md-12 col-12 mb-3">
                                                                <input
                                                                    name="firstName"
                                                                    type="text"
                                                                    className='form-control'
                                                                    placeholder={translateSync("First Name")}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.firstName}
                                                                />
                                                                {errors.firstName && touched.firstName && <div className="error_msg">{errors.firstName}</div>}
                                                            </div>

                                                            <div className="col-md-6 col-12 mb-3">
                                                                <input
                                                                    name="email"
                                                                    type="email"
                                                                    className='form-control'
                                                                    placeholder={translateSync("Email Address")}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={userDetails.email}
                                                                />
                                                                {errors.email && touched.email && <div className="error_msg">{errors.email}</div>}
                                                            </div>

                                                            <div className="col-md-6 col-12 mb-3">
                                                                <input
                                                                    name="phoneNo"
                                                                    type="text"
                                                                    placeholder={translateSync("Phone number")}
                                                                    className='form-control'
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.phoneNo}
                                                                />
                                                                {errors.phoneNo && touched.phoneNo && <div className="error_msg">{errors.phoneNo}</div>}
                                                            </div>

                                                            <div className="col-12 mb-3">
                                                                <textarea
                                                                    name="address1"
                                                                    type="text"
                                                                    placeholder={translateSync('Address')}
                                                                    className='form-control'
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.address1}
                                                                />
                                                                {errors.address1 && touched.address1 && <div className="error_msg">{errors.address1}</div>}
                                                            </div>

                                                            <div className="col-md-12 col-12 mb-3">
                                                                <select
                                                                    className='form-control'
                                                                    style={{ height: "50px" }}
                                                                    name="country"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.country}
                                                                >
                                                                    <option value="">{translateSync('Select a country')}</option>
                                                                    {countryList.length > 0 ?
                                                                        countryList.map((country, i) => (
                                                                            <option key={i} value={country.isoCode}>
                                                                                {country.name}
                                                                            </option>
                                                                        )) :
                                                                        <option>{translateSync('No records')}</option>
                                                                    }
                                                                </select>
                                                                {errors.country && touched.country && <div className="error_msg">{errors.country}</div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-5">
                                                <div className="row pl--50 pl_md--0 pl_sm--0">
                                                    <div className="col-12 mb--60">
                                                        <h4 className="checkout-title">{translateSync('Cart Total')}</h4>
                                                        <div className="checkout-cart-total">
                                                            <h4>{translateSync('Course')} <span>{translateSync('Total')}</span></h4>

                                                            {type == "addToCart" ? (
                                                                <ul>
                                                                    {cartListDetails && cartListDetails.length > 0 &&
                                                                        cartListDetails.map((ival) => (
                                                                            <li key={ival.id}>
                                                                                {translateSync(ival.courseName)}<span>$ {ival.offerPrice ? (ival.offerPrice * 0.95) : ival.price ? (ival.price * 0.95) : '0'}</span>
                                                                                <p>
                                                                                    *{translateSync('VAT Included')}<span> {ival.price ? '5%' : '0'}</span>
                                                                                </p>
                                                                            </li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            ) : (
                                                                <ul>
                                                                    <li>
                                                                        {translateSync(courseDetails.courseName)}
                                                                        <span>$ {courseDetails.offerPrice ? (Number(courseDetails.offerPrice) * 0.95) : courseDetails.price ? (Number(courseDetails.price) * 0.95) : '0'}</span>
                                                                        <p>
                                                                            *{translateSync('VAT Included')}<span> {courseDetails.price ? '5%' : '0'}</span>
                                                                        </p>
                                                                    </li>
                                                                </ul>
                                                            )}

                                                            {type == "addToCart" && (
                                                                <div>
                                                                    <p>{translateSync('Sub Total')} <span>$ {totalPrice ? totalPrice : 0} </span></p>
                                                                    <h4 className="mt--30">{translateSync('Grand Total')} <span>$ {totalPrice ? totalPrice : 0} </span></h4>
                                                                </div>
                                                            )}

                                                            {type == "buynow" && (
                                                                <div>
                                                                    <h4 className="mt--30">{translateSync('Grand Total')} <span>$ {courseDetails.offerPrice ? courseDetails
                                                                        .offerPrice : courseDetails.price ? courseDetails.price : 0}</span></h4>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mb-60">
                                                        <h4 className="checkout-title">{translateSync('Payment Method')}</h4>
                                                        <div className="checkout-payment-method">
                                                            {errors.paymentMethod && touched.paymentMethod && (
                                                                <div className="error_msg">{errors.paymentMethod}</div>
                                                            )}

                                                            <div className="single-method payment-input">
                                                                <input
                                                                    type="radio"
                                                                    id="payment_check"
                                                                    name="paymentMethod"
                                                                    value="noMod"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    checked={values.paymentMethod === "noMod"}
                                                                />
                                                                <label htmlFor="payment_check">
                                                                    <h5>{translateSync('Credit card / Debit card')}</h5>
                                                                </label>
                                                                <p>{translateSync('Please send a Check to Store name with Store Street, Store Town, Store State, Store Postcode, Store Country.')}</p>
                                                            </div>

                                                            {paymentMethods && paymentMethods.length > 0 &&
                                                                paymentMethods.map((ival, index) => {
                                                                    const inputId = `payment_${ival.methodName.toLowerCase().replace(/\s+/g, '_')}_${index}`;
                                                                    return (
                                                                        <div className="single-method payment-input" key={inputId}>
                                                                            <input
                                                                                type="radio"
                                                                                id={inputId}
                                                                                name="paymentMethod"
                                                                                value={ival.methodName}
                                                                                onChange={() => setFieldValue('paymentMethod', ival.methodName)}
                                                                                onBlur={handleBlur}
                                                                                checked={values.paymentMethod === ival.methodName}
                                                                            />
                                                                            <label htmlFor={inputId}>
                                                                                <img
                                                                                    src={IMAGE_URL + ival.methodImage}
                                                                                    alt={ival.methodName}
                                                                                    style={{ width: "150px", border: "1px solid #1111110d", margin: "5px" }}
                                                                                />
                                                                            </label>
                                                                            <p>{translateSync('Please send a Check to Store name with Store Street, Store Town, Store State, Store Postcode, Store Country.')}</p>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>

                                                        <div className="modal fade" id="paymentConfirmationModal" tabIndex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title" id="paymentModalLabel">{translateSync('Confirm Your Payment')}</h5>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="mb-3">
                                                                            <p>{translateSync('Amount in USD:')} <strong>${type == 'buynow' ? courseDetails.offerPrice ? courseDetails.offerPrice : courseDetails.price : totalPrice}</strong></p>
                                                                            <p>{translateSync('Amount in AED:')} <strong>AED {(type == 'buynow' ? courseDetails.offerPrice ? courseDetails.offerPrice : courseDetails.price * 3.675 : totalPrice * 3.675)}</strong> (1 USD = 3.675 AED)</p>
                                                                        </div>

                                                                        <div className="form-check mb-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="paymentConfirmationCheckbox"
                                                                                checked={values.acceptTerms}
                                                                                onChange={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor="paymentConfirmationCheckbox">
                                                                                {translateSync('I confirm that I want to proceed with this payment')}
                                                                            </label>
                                                                            {errors.acceptTerms && touched.acceptTerms && (
                                                                                <div className="error_msg">{errors.acceptTerms}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{translateSync('Cancel')}</button>
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-primary"
                                                                            id="submitPaymentBtn"
                                                                            disabled={!values.acceptTerms || !isValid || !dirty}
                                                                        >
                                                                            {translateSync('Submit Payment')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br></br>
                                                        {/* Policy Links - Updated Styling */}
                                                        {/* <div className="policy-links-container mt-4">
                                                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="policy-link-btn"
                                                                    onClick={() => openPolicyModal('cancellation')}
                                                                >
                                                                    Cancellation & Refund Policy
                                                                </button>
                                                                <span className="policy-link-separator">|</span>
                                                                <button
                                                                    type="button"
                                                                    className="policy-link-btn"
                                                                    onClick={() => openPolicyModal('terms')}
                                                                >
                                                                    Terms & Conditions
                                                                </button>
                                                                <span className="policy-link-separator">|</span>
                                                                <button
                                                                    type="button"
                                                                    className="policy-link-btn"
                                                                    onClick={() => openPolicyModal('privacy')}
                                                                >
                                                                    Privacy Policy
                                                                </button>
                                                            </div>
                                                        </div> */}
                                                        {/* Policy Links */}
                                                        <div className="policy-links mb-4 text-center">
                                                            <button
                                                                className="btn btn-link"
                                                                onClick={() => openPolicyModal('cancellation')}
                                                            >
                                                                {translateSync('Cancellation & Refund Policy')}
                                                            </button>
                                                            <span className="mx-2">|</span>
                                                            <button
                                                                className="btn btn-link"
                                                                onClick={() => openPolicyModal('terms')}
                                                            >
                                                                {translateSync('Terms & Conditions')}
                                                            </button>
                                                            <span className="mx-2">|</span>
                                                            <button
                                                                className="btn btn-link"
                                                                onClick={() => openPolicyModal('privacy')}
                                                            >
                                                                {translateSync('Privacy Policy')}
                                                            </button>
                                                            <span className="mx-2">|</span>
                                                            {/* <button
                                                                className="btn btn-link"
                                                                onClick={() => openPolicyModal('contact')}
                                                            >
                                                                Contact Us
                                                            </button> */}
                                                        </div>
                                                        <br></br>
                                                        <div className="plceholder-button mt--50">
                                                            <button
                                                                className="rbt-btn btn-gradient hover-icon-reverse"
                                                                type="button"
                                                                data-bs-toggle={transectionCurrecy?.currencyName === "AED" ? 'modal' : ''}
                                                                data-bs-target={transectionCurrecy?.currencyName === "AED" ? '#paymentConfirmationModal' : ''}
                                                                disabled={!isValid || !dirty}
                                                                onClick={() => {
                                                                    if (transectionCurrecy?.currencyName !== "AED") {
                                                                        // Handle non-AED payment directly
                                                                        if (isValid && dirty) {
                                                                            formSubmit(values)
                                                                            // document.querySelector('form').submit();
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                <span className="icon-reverse-wrapper">
                                                                    <span className="btn-text">{translateSync('Proceed to Payment')}</span>
                                                                </span>
                                                            </button>
                                                        </div>
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

                {/* popup currency  */}

                {/* Modal Component */}
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
            {/* </div> */}

        </>
    )
}

export default CheckoutPage;