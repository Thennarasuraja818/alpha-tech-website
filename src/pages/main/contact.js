import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country } from 'country-state-city';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ApiProvider from "../../apiProvider/contactusApi"
import { useTranslation } from "../../context/TranslationContext";
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

const countryList = Country.getAllCountries();

const contactusSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    phoneNo: Yup.string().required('Phone no is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    country: Yup.string().required("Country is required"),
});

const ContactPage = () => {
    const navigate = useNavigate();
    const { translateSync } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000 });
    }, []);

    const formSubmit = async (value) => {
        try {
            const input = {
                fullName: value.fullName,
                phoneNo: value.phoneNo,
                email: value.email,
                country: value.country,
                message: value.message
            }
            const result = await ApiProvider.contactus(input)
            if (result && result.status === 200) {
                // Success logic
            }
        } catch (error) { }
    }

    return (
        <div style={{ paddingTop: '80px' }}>
            <Helmet>
                <title>Contact Us | Alpha Technical Rubber Products</title>
                <meta name="description" content="Get in touch with Alpha Technical Rubber Products for inquiries about custom seals, o-rings, and industrial rubber solutions." />
            </Helmet>

            {/* 1. Hero Banner */}
            <section className="bg-primary text-white py-5 mb-5 position-relative" style={{ background: 'linear-gradient(rgba(26, 34, 56, 0.9), rgba(26, 34, 56, 0.8)), url(/img/banner-1.jpg) center/cover', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-3 text-white" data-aos="fade-up">Contact Us</h1>
                    <p className="lead opacity-75" data-aos="fade-up" data-aos-delay="100">
                        We're here to help with your industrial sealing needs.
                    </p>
                </div>
            </section>

            <div className="container mb-5">
                <div className="row g-5">
                    {/* Left Side: Contact Info */}
                    <div className="col-lg-5" data-aos="fade-right">
                        <div className="bg-white p-4 rounded shadow-sm h-100 border text-start">
                            <h3 className="fw-bold mb-3 text-primary">Get in Touch</h3>
                            <p className="text-muted mb-3">
                                Fill out the form or reach us via the details below. Our technical team is ready to assist you.
                            </p>

                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 bg-light p-2 rounded text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-geo-alt fs-5"></i>
                                </div>
                                <div className="ms-3 text-start">
                                    <h6 className="fw-bold mb-1">Headquarters</h6>
                                    <p className="text-muted small mb-0">
                                        Alpha Technical Rubber Products W.L.L<br />
                                        Bldg 123, Road 456, Block 789<br />
                                        Manama, Kingdom of Bahrain
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 bg-light p-2 rounded text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-envelope fs-5"></i>
                                </div>
                                <div className="ms-3 text-start">
                                    <h6 className="fw-bold mb-1">Email Us</h6>
                                    <p className="text-muted small mb-0">
                                        sales@alphatechrubber.com<br />
                                        support@alphatechrubber.com
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex mb-3">
                                <div className="flex-shrink-0 bg-light p-2 rounded text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                    <i className="bi bi-telephone fs-5"></i>
                                </div>
                                <div className="ms-3 text-start">
                                    <h6 className="fw-bold mb-1">Call Us</h6>
                                    <p className="text-muted small mb-0">
                                        +973 1700 6820<br />
                                        Fax: +973 1700 6821
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="col-lg-7" data-aos="fade-left">
                        <div className="bg-white p-4 rounded shadow-lg border-top border-4" style={{ borderColor: 'var(--accent-color)' }}>
                            <h3 className="fw-bold mb-3 text-primary">Send us a Message</h3>

                            <Formik
                                initialValues={{
                                    fullName: '',
                                    email: '',
                                    phoneNo: '',
                                    country: '',
                                    message: ''
                                }}
                                validationSchema={contactusSchema}
                                onSubmit={(values, { resetForm }) => {
                                    formSubmit(values);
                                    resetForm();
                                }}
                            >
                                {({ values, errors, touched, handleChange, handleBlur }) => (
                                    <Form>
                                        <div className="row g-3">
                                            <div className="col-md-6" style={{ textAlign: "left" }}>
                                                <label className="form-label fw-bold small">Full Name</label>
                                                <input
                                                    name="fullName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.fullName}
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className={`form-control ${errors.fullName && touched.fullName ? 'is-invalid' : ''}`}
                                                />
                                                {errors.fullName && touched.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                            </div>
                                            <div className="col-md-6" style={{ textAlign: "left" }}>
                                                <label className="form-label fw-bold small">Phone Number</label>
                                                <input
                                                    name="phoneNo"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.phoneNo}
                                                    type="text"
                                                    placeholder="+973 ..."
                                                    className={`form-control ${errors.phoneNo && touched.phoneNo ? 'is-invalid' : ''}`}
                                                />
                                                {errors.phoneNo && touched.phoneNo && <div className="invalid-feedback">{errors.phoneNo}</div>}
                                            </div>
                                            <div className="col-md-6" style={{ textAlign: "left" }}>
                                                <label className="form-label fw-bold small">Email Address</label>
                                                <input
                                                    name="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.email}
                                                    type="email"
                                                    placeholder="name@company.com"
                                                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                />
                                                {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>
                                            <div className="col-md-6" style={{ textAlign: "left" }}>
                                                <label className="form-label fw-bold small">Country</label>
                                                <select
                                                    className={`form-select ${errors.country && touched.country ? 'is-invalid' : ''}`}
                                                    name="country"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.country}
                                                >
                                                    <option value="">Select Country</option>
                                                    {countryList.map((country, i) => (
                                                        <option key={i} value={country.isoCode}>{country.name}</option>
                                                    ))}
                                                </select>
                                                {errors.country && touched.country && <div className="invalid-feedback">{errors.country}</div>}
                                            </div>
                                            <div className="col-12" style={{ textAlign: "left" }}>
                                                <label className="form-label fw-bold small">Message</label>
                                                <textarea
                                                    name="message"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.message}
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="How can we help you?"
                                                ></textarea>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <button type="submit" className="btn btn-primary w-100 fw-bold py-3" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                                                    Send Message
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="container-fluid p-0">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.612345!2d50.58!3d26.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDEzJzEyLjAiTiA1MMKwMzQnNDguMCJF!5e0!3m2!1sen!2sbh!4v1620000000000!5m2!1sen!2sbh"
                    style={{ width: "100%", height: "450px", border: "0" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </div>
    );
};

export default ContactPage;