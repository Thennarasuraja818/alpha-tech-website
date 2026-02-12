import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiProvider from '../../apiProvider/api';
import emailverifiedfullImage from "../../assets/envelope.png";

const EmailVerify = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await apiProvider.emailverfiy(token);

                if (response.response.data?.isSuccess) {
                    setStatus('success');
                    setMessage(response.response.data.message || 'Your account has been verified.');
                } else {
                    setStatus('error');
                    setMessage(response.response.data.message || 'Verification failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Invalid or expired verification link.');
            }
        };

        if (token) verifyEmail();
    }, [token]);

    const renderStatusContent = () => {
        if (status === 'loading') {
            return <p>Verifying...</p>;
        } else if (status === 'success') {
            return (
                <img
                    src={emailverifiedfullImage}
                    alt="Email Verified"
                    className="img-fluid mb-3"
                    style={{ width: "100px" }}
                />
            );
        } else {
            return <p className="text-danger">Verification Failed ❌</p>;
        }
    };

    return (
        <section className="paymentverifyystatus-transforms-section">
            <div className="container d-flex justify-content-center align-items-center vh-70">
                <div style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="card-body text-center">
                        {renderStatusContent()}
                        <p className="card-text">{message}</p>

                        {status === 'success' && (
                            <button
                                className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3"
                                onClick={() => navigate('/login')}
                            >
                                Go to Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmailVerify;
