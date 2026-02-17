import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import './myaccount.css';
import apiProvider from '../../apiProvider/api';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Country } from 'country-state-city';
import { useTranslation } from "../../context/TranslationContext";

const SignupSchema = Yup.object().shape({
    userName: Yup.string().required('User name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),
    country: Yup.string().required('Country is required'),
    preferredLanguage: Yup.string().required('Preferred language is required'),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[@$!%*?&]/, "Must contain at least one special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    acceptTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('You must accept the terms and conditions'),
});

const RegisterPage = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const { translateSync } = useTranslation();

    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
        window.scrollTo(0, 0);
    }, []);

    const formSubmit = async (value) => {
        try {
            const guestUserId = localStorage.getItem('guestUserId');
            const input = {
                userName: value.userName,
                email: value.email,
                mobileNumber: value.mobileNumber,
                country: value.country,
                preferredLanguage: value.preferredLanguage,
                password: value.password,
                confirmPassword: value.confirmPassword,
                guestUserId: guestUserId || undefined
            }
            const result = await apiProvider.register(input)

            if (result && result.status === 200 && result.response) {
                toast.success("Registration successful! Please login.");
                toast.success("Login Successful!", { autoClose: 1500 });
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error("Registerd failed. Please try again.");
            }

            if (result?.response?.response?.data?.message) {
                toast.error(result.response.response.data.message);
            }

        } catch (error) {
            toast.error("An error occurred during registration.");
        }
    }

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }} className="d-flex align-items-center py-5">
            <Helmet>
                <title>Register | Alpha Technical Rubber Products</title>
                <meta name="description" content="Create an account to order industrial seals and view technical documents." />
            </Helmet>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 shadow-lg rounded bg-white overflow-hidden">
                        <div className="row">
                            {/* Left Side - Image */}
                            <div className="col-md-5 p-0 d-none d-md-block bg-dark position-relative">
                                <img
                                    src="/img/register-banner.jpg"
                                    onError={(e) => e.target.src = '/img/banner-new-1.png'}
                                    alt="Register Banner"
                                    className="w-100 h-100 object-fit-cover opacity-75"
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-4 text-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                    <h2 className="fw-bold mb-3">Join Alpha Tech</h2>
                                    <p className="lead fs-6">Create an account to streamline your ordering process and access exclusive technical resources.</p>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="col-md-7 p-5">
                                <h3 className="fw-bold text-center mb-4 text-primary">Create Account</h3>

                                <Formik
                                    initialValues={{
                                        userName: '',
                                        email: '',
                                        mobileNumber: '',
                                        country: '',
                                        preferredLanguage: '',
                                        password: '',
                                        confirmPassword: '',
                                        acceptTerms: false
                                    }}
                                    validationSchema={SignupSchema}
                                    onSubmit={formSubmit}
                                >
                                    {({ errors, touched, handleChange, handleBlur, values }) => (
                                        <Form>
                                            <div className="row g-3">
                                                <div className="col-md-6 text-start">
                                                    <label className="form-label small fw-bold">Username</label>
                                                    <input
                                                        className={`form-control ${errors.userName && touched.userName ? 'is-invalid' : ''}`}
                                                        name="userName"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="text"
                                                        placeholder="johndoe"
                                                    />
                                                    {errors.userName && touched.userName && <div className="invalid-feedback">{errors.userName}</div>}
                                                </div>

                                                <div className="col-md-6 text-start">
                                                    <label className="form-label small fw-bold">Email</label>
                                                    <input
                                                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                        name="email"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="email"
                                                        placeholder="john@example.com"
                                                    />
                                                    {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>

                                                <div className="col-md-6 text-start">
                                                    <label className="form-label small fw-bold">Mobile Number</label>
                                                    <input
                                                        className={`form-control ${errors.mobileNumber && touched.mobileNumber ? 'is-invalid' : ''}`}
                                                        name="mobileNumber"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="text"
                                                        placeholder="+973 ..."
                                                    />
                                                    {errors.mobileNumber && touched.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                                                </div>

                                                <div className="col-md-6 text-start">
                                                    <label className="form-label small fw-bold">Country</label>
                                                    <select
                                                        className={`form-select ${errors.country && touched.country ? 'is-invalid' : ''}`}
                                                        name="country"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <option value="">Select Country *</option>
                                                        {countries.map((country) => (
                                                            <option key={country.isoCode} value={country.name}>
                                                                {country.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.country && touched.country && <div className="invalid-feedback">{errors.country}</div>}
                                                </div>

                                                <div className="col-12 text-start">
                                                    <label className="form-label small fw-bold">Preferred Language</label>
                                                    <select
                                                        className={`form-select ${errors.preferredLanguage && touched.preferredLanguage ? 'is-invalid' : ''}`}
                                                        name="preferredLanguage"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <option value="">Select Language *</option>
                                                        <option value="English">English</option>
                                                        <option value="Arabic">Arabic</option>
                                                    </select>
                                                    {errors.preferredLanguage && touched.preferredLanguage && <div className="invalid-feedback">{errors.preferredLanguage}</div>}
                                                </div>

                                                <div className="col-md-6 text-start">
                                                    <label className="form-label small fw-bold">Password</label>
                                                    <input
                                                        className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                        name="password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="password"
                                                        placeholder="********"
                                                    />
                                                    {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                                                </div>

                                                <div className="col-md-6 text-start">
                                                    <label className="form-label small fw-bold">Confirm Password</label>
                                                    <input
                                                        className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                                                        name="confirmPassword"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="password"
                                                        placeholder="********"
                                                    />
                                                    {errors.confirmPassword && touched.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                                </div>

                                                <div className="col-12 mt-4 text-start">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="acceptTerms"
                                                            name="acceptTerms"
                                                            checked={values.acceptTerms}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label small" htmlFor="acceptTerms">
                                                            {translateSync('I accept the terms')} &nbsp;
                                                            <span className="text-primary fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/terms')}>Terms</span>
                                                            &nbsp;&&nbsp;
                                                            <span className="text-primary fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy</span>
                                                        </label>
                                                    </div>
                                                    {errors.acceptTerms && touched.acceptTerms && <div className="text-danger small mt-1">{errors.acceptTerms}</div>}
                                                </div>

                                                <div className="col-12 mt-4">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary w-100 fw-bold py-2"
                                                        style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
                                                        disabled={!values.acceptTerms}
                                                    >
                                                        {translateSync('Register')}
                                                    </button>
                                                </div>

                                                <div className="col-12 text-center mt-3">
                                                    <span className="text-muted small">{translateSync('Already have an account?')} </span>
                                                    <button type="button" className="btn btn-link p-0 text-decoration-none fw-bold small" style={{ color: 'var(--primary-color)' }} onClick={() => navigate("/login")}>
                                                        {translateSync('Login')}
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
            </div>
        </div>
    );
};

export default RegisterPage;