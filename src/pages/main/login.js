import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import './myaccount.css';
import apiProvider from '../../apiProvider/api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { login } from '../../redux/authSlice'
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "../../context/TranslationContext";

const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
});

const sendPassword = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const otpSchema = Yup.object().shape({
    otp: Yup.string()
        .matches(/^[0-9]{4}$/, 'OTP must be exactly 4 digits')
        .required('OTP is required')
});

const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
});

const LoginPage = () => {
    const navigate = useNavigate();
    const disPatch = useDispatch()
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // 'email' | 'otp' | 'reset'
    const [userEmail, setUserEmail] = useState('');
    const { translateSync } = useTranslation();

    const formSubmit = async (data) => {
        try {
            const guestUserId = localStorage.getItem('guestUserId');
            const input = {
                email: data.email,
                password: data.password,
                guestUserId: guestUserId || undefined
            };
            const result = await apiProvider.login(input);
            console.error("resulT:", result?.response);

            if (result && result.status === 200 && result.response) {
                localStorage.setItem('userToken', result.response.token);
                const { user, token } = result.response.data;
                disPatch(login({ token: token, user: user }));

                // Store user object for easy retrieval in other components
                localStorage.setItem('user', JSON.stringify(user));

                // Clear guest user ID as it is now merged
                localStorage.removeItem('guestUserId');

                toast.success("Login Successful!", { autoClose: 1500 });
                setTimeout(() => {
                    navigate("/");
                }, 1000);
                return;
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    const handleRequestOtp = async (data) => {
        try {
            const input = { email: data.email };
            const result = await apiProvider.requestForgetPasswordOtp(input);

            if (result && result.status === 200) {
                setUserEmail(data.email);
                setForgotPasswordStep('otp');
                toast.success("OTP sent to your email!", { autoClose: 2000 });
            } else {
                const errorMsg = result?.response?.response?.data?.message || "Failed to send OTP";
                toast.error(errorMsg, { autoClose: 2000 });
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    const handleVerifyOtp = async (data) => {
        try {
            const input = { email: userEmail, otp: data.otp };
            const result = await apiProvider.verifyForgetPasswordOtp(input);

            if (result && result.status === 200) {
                setForgotPasswordStep('reset');
                toast.success("OTP verified successfully!", { autoClose: 1500 });
            } else {
                const errorMsg = result?.response?.response?.data?.message || "Invalid OTP";
                toast.error(errorMsg, { autoClose: 2000 });
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    const handleResetPassword = async (data) => {
        try {
            const input = { email: userEmail, password: data.password, confirmPassword: data.confirmPassword };
            const result = await apiProvider.resetPassword(input);

            if (result && result.status === 200) {
                toast.success("Password updated successfully!", { autoClose: 1500 });
                setTimeout(() => {
                    setShowForgotPassword(false);
                    setForgotPasswordStep('email');
                    setUserEmail('');
                }, 1500);
            } else {
                const errorMsg = result?.response?.response?.data?.message || "Failed to reset password";
                toast.error(errorMsg, { autoClose: 2000 });
            }
        } catch (err) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setForgotPasswordStep('email');
        setUserEmail('');
    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }} className="d-flex align-items-center">
            <Helmet>
                <title>Login | Alpha Technical Rubber Products</title>
                <meta name="description" content="Login to access your Alpha Tech account." />
            </Helmet>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10 shadow-lg rounded bg-white overflow-hidden">
                        <div className="row">
                            {/* Left Side - Image */}
                            <div className="col-md-6 p-0 d-none d-md-block position-relative bg-dark">
                                <img
                                    src="/img/login-banner.jpg"
                                    onError={(e) => e.target.src = '/img/banner-new-1.png'}
                                    alt="Login Banner"
                                    className="w-100 h-100 object-fit-cover opacity-75"
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                    <h2 className="fw-bold mb-3">Welcome Back</h2>
                                    <p className="lead fs-6">Access your dashboard to manage orders and view technical resources.</p>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="col-md-6 p-5">
                                <div className="text-center mb-4">
                                    <h3 className="fw-bold text-primary mb-2">Alpha Tech</h3>
                                    <p className="text-muted small">Industrial Sealing Solutions</p>
                                </div>

                                {showForgotPassword ? (
                                    <>
                                        {forgotPasswordStep === 'email' && (
                                            <>
                                                <h4 className="fw-bold mb-3 text-start text-primary">{translateSync('Forgot Password')}</h4>
                                                <p className="text-muted mb-4 small text-start">Enter your email to receive a 4-digit OTP.</p>
                                                <Formik
                                                    initialValues={{ email: '' }}
                                                    validationSchema={sendPassword}
                                                    onSubmit={handleRequestOtp}
                                                >
                                                    {({ errors, touched, handleChange, handleBlur }) => (
                                                        <Form>
                                                            <div className="mb-3 text-start">
                                                                <label className="form-label small fw-bold">Email Address</label>
                                                                <input
                                                                    className={`form-control py-2 ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                                    name="email"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    type="email"
                                                                    placeholder="name@example.com"
                                                                />
                                                                {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                                                            </div>

                                                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mt-2" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                                                                Send OTP
                                                            </button>

                                                            <div className="text-center mt-4">
                                                                <button type="button" className="btn btn-link text-decoration-none text-muted small" onClick={handleBackToLogin}>
                                                                    Back to Login
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </>
                                        )}

                                        {forgotPasswordStep === 'otp' && (
                                            <>
                                                <h4 className="fw-bold mb-3 text-start text-primary">Verify OTP</h4>
                                                <p className="text-muted mb-4 small text-start">Enter the 4-digit OTP sent to <strong>{userEmail}</strong></p>
                                                <Formik
                                                    initialValues={{ otp: '' }}
                                                    validationSchema={otpSchema}
                                                    onSubmit={handleVerifyOtp}
                                                >
                                                    {({ errors, touched, handleChange, handleBlur, values }) => (
                                                        <Form>
                                                            <div className="mb-3 text-start">
                                                                <label className="form-label small fw-bold">Enter OTP</label>
                                                                <input
                                                                    className={`form-control py-2 text-center fw-bold fs-5 ${errors.otp && touched.otp ? 'is-invalid' : ''}`}
                                                                    name="otp"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    type="text"
                                                                    placeholder="0000"
                                                                    maxLength="4"
                                                                    style={{ letterSpacing: '0.5rem' }}
                                                                />
                                                                {errors.otp && touched.otp && <div className="invalid-feedback">{errors.otp}</div>}
                                                            </div>

                                                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mt-2" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                                                                Verify OTP
                                                            </button>

                                                            <div className="text-center mt-4">
                                                                <button type="button" className="btn btn-link text-decoration-none text-muted small" onClick={() => setForgotPasswordStep('email')}>
                                                                    Change Email
                                                                </button>
                                                                <span className="mx-2 text-muted">|</span>
                                                                <button type="button" className="btn btn-link text-decoration-none text-muted small" onClick={handleBackToLogin}>
                                                                    Back to Login
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </>
                                        )}

                                        {forgotPasswordStep === 'reset' && (
                                            <>
                                                <h4 className="fw-bold mb-3 text-start text-primary">Reset Password</h4>
                                                <p className="text-muted mb-4 small text-start">Enter your new password for <strong>{userEmail}</strong></p>
                                                <Formik
                                                    initialValues={{ password: '', confirmPassword: '' }}
                                                    validationSchema={resetPasswordSchema}
                                                    onSubmit={handleResetPassword}
                                                >
                                                    {({ errors, touched, handleChange, handleBlur }) => (
                                                        <Form>
                                                            <div className="mb-3 text-start">
                                                                <label className="form-label small fw-bold">New Password</label>
                                                                <input
                                                                    className={`form-control py-2 ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                                    name="password"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    type="password"
                                                                    placeholder="Enter new password"
                                                                />
                                                                {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                                                            </div>

                                                            <div className="mb-3 text-start">
                                                                <label className="form-label small fw-bold">Confirm Password</label>
                                                                <input
                                                                    className={`form-control py-2 ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                                                                    name="confirmPassword"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    type="password"
                                                                    placeholder="Confirm new password"
                                                                />
                                                                {errors.confirmPassword && touched.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                                            </div>

                                                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mt-2" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                                                                Reset Password
                                                            </button>

                                                            <div className="text-center mt-4">
                                                                <button type="button" className="btn btn-link text-decoration-none text-muted small" onClick={handleBackToLogin}>
                                                                    Back to Login
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <h4 className="fw-bold mb-4 text-start text-primary">{translateSync('Login')}</h4>
                                        <Formik
                                            initialValues={{ email: '', password: '' }}
                                            validationSchema={SigninSchema}
                                            onSubmit={formSubmit}
                                        >
                                            {({ errors, touched, handleChange, handleBlur }) => (
                                                <Form>
                                                    <div className="mb-3 text-start">
                                                        <label className="form-label small fw-bold">Email Address</label>
                                                        <input
                                                            className={`form-control py-2 ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                            name="email"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            type="email"
                                                            placeholder="name@example.com"
                                                        />
                                                        {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                                                    </div>

                                                    <div className="mb-3 text-start">
                                                        <label className="form-label small fw-bold">Password</label>
                                                        <input
                                                            className={`form-control py-2 ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                            name="password"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            type="password"
                                                            placeholder="Enter your password"
                                                        />
                                                        {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                                                    </div>

                                                    <div className="d-flex justify-content-end mb-4">
                                                        <button type="button" className="btn btn-link p-0 text-decoration-none small" style={{ color: 'var(--accent-color)' }} onClick={() => setShowForgotPassword(true)}>
                                                            {translateSync('Forgot password?')}
                                                        </button>
                                                    </div>

                                                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                                                        {translateSync('Log In')}
                                                    </button>

                                                    <div className="text-center mt-4">
                                                        <span className="text-muted small">{translateSync("Don't have an account?")} </span>
                                                        <button type="button" className="btn btn-link p-0 text-decoration-none fw-bold small" style={{ color: 'var(--primary-color)' }} onClick={() => navigate("/register")}>
                                                            {translateSync('Register Now')}
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
};

export default LoginPage;