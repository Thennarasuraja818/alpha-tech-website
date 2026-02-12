import React, { useState, useEffect } from "react";
import ApiProvider from "../../apiProvider/addToCartApi";
import { IMAGE_URL } from "../../network/apiClient";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiProvider from "../../apiProvider/api";
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';

import { Helmet } from 'react-helmet-async';
import { useTranslation } from "../../context/TranslationContext";




const userDetailsSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    phoneNo: Yup.string().required('Phone number is required'),
    // email: Yup.string().email('Invalid email').required('Email is required'),
    address: Yup.string().required('Address is required'),

});
const passwordSchema = Yup.object().shape({

    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});


const MyAccountPage = () => {
    const countryList = Country.getAllCountries();
    const [pdfUrl, setPdfUrl] = useState('');
    const [userDetails, setUserDetails] = useState([])
    const [cartListDetails, setCartListDetails] = useState([])
    const [purchaseListDetails, setPurchaseListDetails] = useState([])
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();




    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get("tab") || "dashboad"; // fallback to 'dashboad'
    const [activeTab, setActiveTab] = useState(tabFromUrl);

    useEffect(() => {
        const navLinks = document.querySelectorAll('.rbt-my-account-tab-button .nav-link');
        const tabContents = document.querySelectorAll('.tab-pane');

        // Remove all active classes
        navLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(tab => {
            tab.classList.remove('show');
            tab.classList.remove('active');
        });

        // Activate nav link and tab pane by ID
        const activeLink = document.querySelector(`.rbt-my-account-tab-button .nav-link[data-tab="${activeTab}"]`);
        const activePane = document.getElementById(activeTab);

        if (activeLink) activeLink.classList.add('active');
        if (activePane) {
            activePane.classList.add('show');
            activePane.classList.add('active');
        }
    }, [activeTab]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };



    useEffect(() => {
        getCartCount(); // Fetch count on page load
    }, []);

    const getCartCount = async () => {
        try {
            const result = await ApiProvider.getUserDetails();
            console.log(result, "result--rrrr");

            if (result.status && result.response) {
                // Assuming the API returns cart items in response.data.cartDetails
                setUserDetails(result.response.data.userDetail);
                setCartListDetails(result.response.data.cartDetails)
                // setPurchaseListDetails(result.response.data.userPurchaseDetails)
                let successData = []
                result.response.data.userPurchaseDetails.map(async (ival) => {
                    if (ival.paymentStatus == "Success") {
                        await successData.push(ival)
                    }
                })
                console.log(successData, "sssssssssssssss");

                setPurchaseListDetails(successData.reverse());

            }

        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    const handleUserDetailsSubmit = async (formData) => {
        console.log("Sending form data to server:", formData);
        try {
            const input = {
                userId: userDetails.userId,
                name: userDetails.name,
                email: userDetails.email,
                address: formData.address,
                phoneNo: formData.phoneNo,
                postalCode: formData.postalCode,
                country: formData.country,
                // currentPassword: formData.currentPassword,
                // confirmPassword: formData.confirmPassword,
                // newPassword: formData.newPassword
            }
            console.log(input, "input");

            const result = await apiProvider.addAddress(input)
            console.log(result);
            if (result && result.response) {
                // window.location.reload();
                getCartCount(); // Fetch count on page load
            }
            if (result.response.response.data.message) {
                let toastMsg = result.response.response.data.message
                console.log(toastMsg, "toastMsg");
                toast(toastMsg)
            }

        } catch (error) {

        }
        // Example: Call an API
        // axios.post('/api/update-profile', formData)
        //   .then(response => console.log('Success:', response))
        //   .catch(error => console.error('Error:', error));
    };

    const handlePasswordChangeSubmit = async (formData) => {
        console.log("Sending form data to server:", formData);
        try {
            const input = {
                userId: userDetails.userId,
                // name: userDetails.name,
                // email: userDetails.email,
                // address: formData.address,
                // phoneNo: formData.phoneNo,
                // postalCode: formData.postalCode,
                currentPassword: formData.currentPassword,
                confirmPassword: formData.confirmPassword,
                newPassword: formData.newPassword
            }
            console.log(input, "input");

            const result = await apiProvider.addAddress(input)
            console.log(result);
            if (result && result.response) {
                // window.location.reload();
                getCartCount(); // Fetch count on page load
            }
            if (result.response.response.data.message) {
                let toastMsg = result.response.response.data.message
                console.log(toastMsg, "toastMsg");
                toast(toastMsg)
            }

        } catch (error) {

        }
        // Example: Call an API
        // axios.post('/api/update-profile', formData)
        //   .then(response => console.log('Success:', response))
        //   .catch(error => console.error('Error:', error));
    };


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit',
        });
    };

    useEffect(() => {
        if (tabFromUrl) {
            console.log(tabFromUrl, "tabFromUrl-uuuu");
            setActiveTab(tabFromUrl);
        }

    }, [tabFromUrl])

    console.log(purchaseListDetails, "purchaseListDetails");
    const viewCertificate = async (course) => {
        // console.log(course, "cccccccccccccccccc");
        let input = {
            categoryName: course.categoryName,
            courseName: course.courseName,
            courseDate: course.courseDate

        }
        console.log("input", input);
        const result = await apiProvider.certificateView(input)
        console.log(result.response.data, "result");
        // In your frontend code (temporary debug code)
        const blob = new Blob([result.response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'ilap-certificate.pdf';
        link.click();
        // const blob = new Blob([result.response.data], { type: 'application/pdf' });

        // // Create an object URL
        // const url = URL.createObjectURL(blob);

        // // Open in new tab
        // const newWindow = window.open();
        // newWindow.location.href = url;

        // const blob = new Blob([result.response.data], { type: 'application/pdf' });

        // const blobUrl = URL.createObjectURL(blob);
        // window.open(blobUrl, '_blank');
        // con
    }

    return (
        <>

            <Helmet>
                <title>Leadership management course | iLap</title>
                <meta
                    name="keywords"
                    content="training courses uae, training centers Dubai, training courses Dubai, training courses Abu Dhabi, corporate training UAE, leadership development Dubai, soft skills training UAE, HR consulting Dubai"
                />

            </Helmet>

            <div>



                <section className="Home-banner-3  text-white py-5 position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center  home-header" >
                            <div className="innerbanner-txt ">
                                <h1 className="fw-bold text-center display-5  font-51">{translateSync('My Account')}</h1>
                                {/* <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.html" title="" itemprop="url">About</a></li>
                                    <li class="breadcrumb-item active">Our Facilitators</li>
                                </ol> */}
                            </div>

                        </div>

                    </div>
                </section>

                <div class="my-account-section bg-color-white rbt-section-gap">
                    <div class="container my-5">

                        <div class="row">
                            <div class="col-12">
                                <div class="row g-5">

                                    <div class="col-lg-3 col-12">
                                        <div className="rbt-my-account-tab-button nav flex-column nav-pills" role="tablist">
                                            <a data-tab="dashboad" onClick={() => handleTabClick("dashboad")} className="nav-link">{translateSync('Dashboard')}</a>
                                            <a data-tab="download" onClick={() => handleTabClick("download")} className="nav-link">{translateSync('My Courses')}</a>
                                            <a data-tab="account-info" onClick={() => handleTabClick("account-info")} className="nav-link">{translateSync('Basic Info')}</a>
                                        </div>
                                    </div>

                                    <div class="col-lg-9 col-12">
                                        <div class="tab-content" id="myaccountContent">

                                            <div class="tab-pane fade active show" id="dashboad" role="tabpanel">
                                                <div class="rbt-my-account-inner">
                                                    <h3>{translateSync('Dashboard')}</h3>
                                                    <div class="about-address mb--20">
                                                        <p>{userDetails.email || ""}</p>
                                                        <p>{translateSync('Hello')}, <strong>{translateSync(userDetails.name) || ""}</strong>
                                                            {/* (If Not<a href="login.php" class="logout"> Logout</a>) */}
                                                        </p>
                                                    </div>
                                                    {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
                                                </div>
                                                <div class="rbt-my-account-table table-responsive text-center">
                                                    <table class="table table-bordered">
                                                        <thead class="thead-light">
                                                            <tr>
                                                                <th>{translateSync('Image')}</th>
                                                                <th>{translateSync('Course Name')}</th>
                                                                <th>{translateSync('Type')}</th>
                                                                <th>{translateSync('Duration')}</th>
                                                                <th>{translateSync('Language')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cartListDetails && cartListDetails.map((ival) => (
                                                                <tr key={ival.id}>
                                                                    <td className="pro-thumbnail">
                                                                        <img
                                                                            src={IMAGE_URL + ival.categoryImage}
                                                                            alt="Product"
                                                                            style={{ width: "70px" }}
                                                                        />
                                                                    </td>
                                                                    <td className="pro-title text-decoration-none">
                                                                        <h6 className="pro-title text-decoration-none">{translateSync(ival.categoryName)}</h6>
                                                                        <p>{translateSync(ival.courseName)}</p>
                                                                    </td>
                                                                    <td className="pro-subtotal"><span>{translateSync(ival.categoryType)}</span></td>
                                                                    <td className="pro-subtotal"><span>3 Days</span></td>
                                                                    <td className="pro-subtotal"><span>{ival.lang}</span></td>


                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div class="tab-pane fade" id="orders" role="tabpanel">
                                                <div class="rbt-my-account-inner">
                                                    <h3>{translateSync('Payment History')}</h3>
                                                    <div class="rbt-my-account-table table-responsive text-center">
                                                        <table class="table table-bordered">
                                                            <thead class="thead-light">
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>{translateSync('Course Name')}</th>
                                                                    <th>{translateSync('Date')}</th>
                                                                    <th>{translateSync('Status')}</th>
                                                                    <th>{translateSync('Total')}</th>
                                                                    <th>{translateSync('Action')}</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>{translateSync("Customer Service")}</td>
                                                                    <td>Jan 22, 2025</td>
                                                                    <td>Pending</td>
                                                                    <td>$45</td>
                                                                    <td>
                                                                        <a class="rbt-btn btn-gradient btn-sm btn-primary" href="#">Invoice</a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="tab-pane fade" id="download" role="tabpanel">
                                                <div class="rbt-my-account-inner">
                                                    <h3>{translateSync('Purchase Courses List')}</h3>
                                                    <div class="rbt-my-account-table table-responsive text-center">
                                                        <table class="table table-bordered">
                                                            <thead class="thead-light">
                                                                <tr>
                                                                    <th>{translateSync('Image')}</th>
                                                                    <th>{translateSync('Course Name')}</th>
                                                                    {/* <th>Type</th> */}
                                                                    <th>{translateSync('Duration')}</th>
                                                                    <th>{translateSync('Language')}</th>
                                                                    <th>{translateSync('Purchase Status')}</th>
                                                                    <th>{translateSync('Purchase Date')}</th>
                                                                    <th>{translateSync('Certificate')}</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {purchaseListDetails && purchaseListDetails.map((ival) => (
                                                                    <tr key={ival.id}>
                                                                        <td className="pro-thumbnail">
                                                                            <img
                                                                                src={IMAGE_URL + ival.categoryImage}
                                                                                alt="Product"
                                                                                style={{ width: "70px" }}
                                                                            />
                                                                        </td>
                                                                        <td className="pro-title text-decoration-none">
                                                                            <h6 className="pro-title text-decoration-none">{translateSync(ival.categoryName)}</h6>
                                                                            <p>{translateSync(ival.courseName)}</p>
                                                                        </td>
                                                                        {/* <td className="pro-subtotal"><span>{ival.categoryType}</span></td> */}
                                                                        <td className="pro-subtotal"><span>3 Days</span></td>
                                                                        <td className="pro-subtotal"><span>{ival.lang}</span></td>
                                                                        <td className="pro-subtotal"><span>{translateSync(ival.paymentStatus)}</span></td>
                                                                        <td className="pro-subtotal"><span>{formatDate(ival.purchaseDate)}</span></td>
                                                                        {ival.courseStatus == "Completed" ?
                                                                            <td> <button class="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3" style={{ fontSize: "13px", color: "#fff", padding: "5px 8px 5px 8px", height: "35px", lineHeight: "23px", border: "2px solid #582d86" }}
                                                                                onClick={() => viewCertificate(ival)}
                                                                            ><span data-text={translateSync("Open")}>{translateSync('View Certificate')}</span></button>
                                                                            </td> :
                                                                            <td className="pro-subtotal"><span>{ival.courseStatus}</span></td>
                                                                        }


                                                                    </tr>
                                                                ))}

                                                            </tbody>
                                                        </table>
                                                        {purchaseListDetails.length === 0 &&
                                                            <>
                                                                <br>
                                                                </br>
                                                                <center style={{ display: "flex", justifyContent: "center" }}>
                                                                    {translateSync('No course purchases yet.')}
                                                                </center>
                                                            </>
                                                        }
                                                        {/* <iframe src={pdfUrl} width="100%" height="600px" title="PDF Viewer" /> */}

                                                    </div>
                                                </div>
                                            </div>

                                            <div class="tab-pane fade" id="payment-method" role="tabpanel">
                                                <div class="rbt-my-account-inner">
                                                    <h3>Payment History</h3>
                                                    <p class="rbt-saved-message">You Can't Save Your Payment Method yet.</p>
                                                </div>
                                            </div>

                                            <div class="tab-pane fade" id="address-edit" role="tabpanel">
                                                <div class="rbt-my-account-inner">
                                                    <h3>{translateSync('Billing Address')}</h3>
                                                    <address>
                                                        <p><strong>Banani, Dhaka</strong></p>
                                                        <p>1205 Supper Market<br></br>Surat, India</p>
                                                        <p>Mobile: 01911111111</p>
                                                    </address>
                                                    <div class="rbt-link-hover">
                                                        <a href="#" class="d-inline-block btn btn-outline-secondary btn-sm">Edit Address</a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="tab-pane fade" id="account-info" role="tabpanel">
                                                <div class="rbt-my-account-inner">
                                                    <h3>{translateSync("Billing Address")}</h3>
                                                    <div class="account-details-form">
                                                        {/* <form action="#"> */}
                                                        {/* <Formik
                                                            initialValues={{
                                                                name: "",
                                                                phoneNo: "",
                                                                email: userDetails.email,
                                                                address: "",
                                                                postalCode:"",
                                                                currentPassword: "",
                                                                newPassword: "",
                                                                confirmPassword: ""

                                                            }}
                                                            validationSchema={addressFromSchema}
                                                            onSubmit={values => {
                                                                formSubmit(values)
                                                            }}
                                                        >
                                                            {({ errors, touched, handleChange, handleBlur }) => (
                                                                <Form>
                                                                    <div className="row g-4">
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="name"
                                                                                className="form-control"
                                                                                placeholder="Full Name"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={userDetails.name}
                                                                            />
                                                                            {errors.name && touched.name && <div className="error_msg">{errors.name}</div>}
                                                                        </div>
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="email"
                                                                                className="form-control"
                                                                                placeholder="Email"
                                                                                type="email"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={userDetails.email}
                                                                            />
                                                                            {errors.email && touched.email && <div className="error_msg">{errors.email}</div>}
                                                                        </div>
                                                                        <div className="col-lg-12 col-12">
                                                                            <textarea
                                                                                name="address"
                                                                                className="form-control"
                                                                                placeholder="Address"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            // value={userDetails.address || ""}
                                                                            />
                                                                            {errors.address && touched.address && <div className="error_msg">{errors.address}</div>}
                                                                        </div>
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="phoneNo"
                                                                                className="form-control"
                                                                                placeholder="Phone Number"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            // value={userDetails.phoneNo || ""}
                                                                            />
                                                                            {errors.phoneNo && touched.phoneNo && <div className="error_msg">{errors.phoneNo}</div>}
                                                                        </div>
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="postalCode"
                                                                                className="form-control"
                                                                                placeholder="Postal code"
                                                                                type="text"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            // value={userDetails.phoneNo || ""}
                                                                            />
                                                                            {errors.postalCode && touched.postalCode && <div className="error_msg">{errors.postalCode}</div>}
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <h4>Password Change</h4>
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <input
                                                                                name="currentPassword"
                                                                                className="form-control"
                                                                                placeholder="Current Password"
                                                                                type="password"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            // value={values.currentPassword}
                                                                            />
                                                                            {errors.currentPassword && touched.currentPassword && <div className="error_msg">{errors.currentPassword}</div>}
                                                                        </div>
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="newPassword"
                                                                                className="form-control"
                                                                                placeholder="New Password"
                                                                                type="password"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            // value={values.newPassword}
                                                                            />
                                                                            {errors.newPassword && touched.newPassword && <div className="error_msg">{errors.newPassword}</div>}
                                                                        </div>
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="confirmPassword"
                                                                                className="form-control"
                                                                                placeholder="Confirm Password"
                                                                                type="password"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            // value={values.confirmPassword}
                                                                            />
                                                                            {errors.confirmPassword && touched.confirmPassword && <div className="error_msg">{errors.confirmPassword}</div>}
                                                                        </div>
                                                                        <div className="col-12">
                                                                            <button type="submit" className="rbt-btn btn-gradient icon-hover btn-primary">
                                                                                <span className="btn-text">Save Changes</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            )}

                                                        </Formik> */}
                                                        <Formik
                                                            enableReinitialize
                                                            initialValues={{
                                                                name: userDetails.name || "",
                                                                email: userDetails.email || "",
                                                                phoneNo: userDetails.phoneNo || "",
                                                                address: userDetails.address || "",
                                                                postalCode: userDetails.postalCode || "",
                                                                country: userDetails.country || ""
                                                            }}
                                                            validationSchema={userDetailsSchema}
                                                            onSubmit={handleUserDetailsSubmit}
                                                        >
                                                            {({ values, handleChange, handleBlur, errors, touched }) => (
                                                                <Form>
                                                                    <div className="row g-4">
                                                                        {/* Full Name */}
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="name"
                                                                                className="form-control"
                                                                                placeholder={translateSync("Full Name")}
                                                                                value={userDetails.name}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.name && touched.name && <div className="error_msg">{translateSync(errors.name)}</div>}
                                                                        </div>

                                                                        {/* Email */}
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="email"
                                                                                className="form-control"
                                                                                placeholder={translateSync("Email")}
                                                                                value={userDetails.email}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.email && touched.email && <div className="error_msg">{translateSync(errors.email)}</div>}
                                                                        </div>

                                                                        {/* Address */}
                                                                        <div className="col-12">
                                                                            <textarea
                                                                                name="address"
                                                                                className="form-control"
                                                                                placeholder={translateSync("Address")}
                                                                                value={values.address}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.address && touched.address && <div className="error_msg">{translateSync(errors.address)}</div>}
                                                                        </div>

                                                                        {/* Phone & Postal */}
                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="phoneNo"
                                                                                className="form-control"
                                                                                placeholder={translateSync("Phone Number")}
                                                                                value={values.phoneNo}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.phoneNo && touched.phoneNo && <div className="error_msg">{translateSync(errors.phoneNo)}</div>}
                                                                        </div>
                                                                        <div className="col-lg-6 col-12">
                                                                            {/* <input
                                                                                name="postalCode"
                                                                                className="form-control"
                                                                                placeholder="Postal Code"
                                                                                value={values.postalCode}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            /> */}
                                                                            <select
                                                                                className='form-control'
                                                                                style={{ height: "50px" }}
                                                                                name={translateSync("country")}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.country}
                                                                            >
                                                                                <option value="">{translateSync('Select a country')}</option>
                                                                                {countryList.length > 0 ?
                                                                                    countryList.map((country, i) => {
                                                                                        return (
                                                                                            <option key={i} value={country.isoCode}>
                                                                                                {country.name}
                                                                                            </option>
                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    <option>{translateSync('No records')}</option>
                                                                                }
                                                                            </select>
                                                                            {/* {errors.country && touched.country && <div className="error_msg">{errors.country}</div>} */}
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <button type="submit" className="rbt-btn btn-gradient icon-hover btn-primary">
                                                                                <span className="btn-text">{translateSync('Save Personal Info')}</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                        <br></br>

                                                        {/* --- PASSWORD CHANGE FORM --- */}
                                                        <Formik
                                                            initialValues={{
                                                                currentPassword: "",
                                                                newPassword: "",
                                                                confirmPassword: "",
                                                            }}
                                                            validationSchema={passwordSchema}
                                                            onSubmit={async (values, { resetForm }) => {
                                                                await handlePasswordChangeSubmit(values); // your existing function
                                                                resetForm(); // ✅ resets the form after submit
                                                            }}
                                                        >
                                                            {({ values, handleChange, handleBlur, errors, touched }) => (
                                                                <Form>
                                                                    <div className="row g-4">
                                                                        <div className="col-12">
                                                                            <h4>{translateSync('Password Change')}</h4>
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <input
                                                                                name="currentPassword"
                                                                                className="form-control"
                                                                                placeholder={translateSync("Current Password")}
                                                                                type="password"
                                                                                value={values.currentPassword}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.currentPassword && touched.currentPassword && <div className="error_msg">{translateSync(errors.currentPassword)}</div>}
                                                                        </div>

                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="newPassword"
                                                                                className="form-control"
                                                                                placeholder={translateSync("New Password")}
                                                                                type="password"
                                                                                value={values.newPassword}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.newPassword && touched.newPassword && <div className="error_msg">{translateSync(errors.newPassword)}</div>}
                                                                        </div>

                                                                        <div className="col-lg-6 col-12">
                                                                            <input
                                                                                name="confirmPassword"
                                                                                className="form-control"
                                                                                placeholder={translateSync("Confirm Password")}
                                                                                type="password"
                                                                                value={values.confirmPassword}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            {errors.confirmPassword && touched.confirmPassword && <div className="error_msg">{translateSync(errors.confirmPassword)}</div>}
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <button type="submit" className="rbt-btn btn-gradient icon-hover btn-primary">
                                                                                <span className="btn-text">{translateSync('Change Password')}</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                        {/* </form> */}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />

            </div>

        </>
    )
}

export default MyAccountPage;