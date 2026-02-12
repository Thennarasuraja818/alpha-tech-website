import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import apiProvider from '../.././apiProvider/checkoutApi';
import paymentSuccessfullImage from "../../assets/payment-check.png"
import paymentFailedfullImage from "../../assets/payment-failed.png"
import { useTranslation } from "../../context/TranslationContext";

const PaymentSuccess = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('status');
    const transactionId = queryParams.get('transactionId');
    const userId = queryParams.get('userId');
    const [paymentDetails, setPaymentDetails] = useState(null);

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [getpaymentStatus, setGetpaymentStatus] = useState('');

    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();


    // useEffect(() => {
    //     console.log("paymentStatus:",paymentStatus, paymentStatus==="success")
    //     if (paymentStatus === "success") {
    //         let reqData = {
    //             "event": "link.paid",
    //             "data": {
    //               "id": "lnk_abc123",
    //               "status": "paid",
    //               "customer": {
    //                 "name": "Kesavan",
    //                 "email": "kesavand0611@gmail.com"
    //               },
    //               "amount": 100,
    //               "currency": "AED"
    //             }
    //           }

    //         nomodWebhook(reqData)
    //     }
    // }, [paymentStatus]);
    useEffect(() => {
        if (paymentStatus && transactionId) {
            console.log(transactionId, "transactionId");
            console.log(paymentStatus, "paymentStatus");
            console.log(userId, "userId");

            const verifyPayment = async () => {
                try {
                    const response = await apiProvider.verifyCheck({ transactionId, userId, paymentStatus })
                    console.log(response, "ressssss-success");
                    if (response && response.data && response.data.paymentStatus) {
                        setGetpaymentStatus(response.data.paymentStatus)
                    }
                    // If you need to call a webhook
                } catch (error) {
                    console.error("Payment verification failed:", error);
                }
            };

            verifyPayment();
        }
    }, [paymentStatus, transactionId, userId]);

    // useEffect(() => {
    //     if (paymentStatus != "success") {
    //         // Fetch payment details from backend using transactionI
    //         const verifyPayment = async () => {
    //             try {

    //                 const response = await apiProvider.verifyCheck({ transactionId, userId, paymentStatus })

    //                 console.log(response, "ressssss-failed");
    //                 if (response && response.data && response.data.paymentStatus) {
    //                     setGetpaymentStatus(response.data.paymentStatus)
    //                 }

    //                 // If you need to call a webhook
    //                 // if (response.data.nomodId) {
    //                 //     const webhookData = {
    //                 //         event: "link.paid",
    //                 //         data: {
    //                 //             id: response.data.nomodId,
    //                 //             status: "paid",
    //                 //             customer: {
    //                 //                 name: response.data.userName,
    //                 //                 email: response.data.userEmail
    //                 //             },
    //                 //             amount: response.data.amount,
    //                 //             currency: "AED"
    //                 //         }
    //                 //     };
    //                 //     // await axios.post('/api/webhooks/nomod', webhookData);
    //                 // }
    //             } catch (error) {
    //                 console.error("Payment verification failed:", error);
    //             }
    //         };

    //         verifyPayment();
    //     }
    // }, [paymentStatus, transactionId, userId]);

    const nomodWebhook = async (data) => {
        try {
            if (status === "loading") {
                const response = await apiProvider.paymentverify(data);
                if (response && response.status == 200) {
                    navigate(window.location.pathname, { replace: true });
                    setStatus('success');
                    setMessage(response.response.data.message || 'Your payment was successful.');
                } else {
                    setStatus('error');
                    setMessage(response.response.data.message || 'Payment verification failed.');
                }
            }
        } catch (error) {
            console.log("Error during payment verification:", error);
            setStatus('error');
            setMessage('There was an issue verifying your payment. Please try again.');
        }
    };
    console.log(getpaymentStatus, "getpaymentStatus");

    return (


        <section className="paymentseccessstatus-transforms-section  ">

            <div className="container d-flex justify-content-center align-items-center vh-70 ">

                <div className="text-center py-5">
                    {paymentStatus === "success" ?
                        <center>
                            <img
                                src={paymentSuccessfullImage}
                                alt="Empty Cart"
                                className="img-fluid"
                                style={{ width: "150px", marginBottom: "20px" }}
                            />

                            <h2>{translateSync('Payment Success')}</h2>
                            <p className="text-muted">{translateSync("Thank you for your payment. We’ll be in touch shortly with more details.")}</p>
                        </center>
                        : <>

                            <center>
                                <img
                                    src={paymentFailedfullImage}
                                    alt="Empty Cart"
                                    className="img-fluid"
                                    style={{ width: "150px", marginBottom: "20px" }}
                                />

                                <h2>{translateSync('Payment Failed')}</h2>
                                <p className="text-muted">{translateSync('Your payment could not be processed. Please check your card details or try a different payment method.')}</p>
                            </center>
                        </>
                    }
                    <h4></h4>
                    <button
                        className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3"
                        onClick={() => navigate(`/`)}
                    >
                        <span data-text={translateSync("Browse Courses")}>{translateSync('Go to Home')}</span>
                    </button>
                </div>




                {/* <div className="card">
      <div className="checkiconn" style={{borderRadius: '200px', height: '200px', width: '200px', background: '#F8FAF5', margin: '0 auto'}}>
        <i class="checkmark">✓</i>
      </div>
        <h1>Success</h1>
        <p>We received your purchase request;<br/> we'll be in touch shortly!</p>
      </div> */}


            </div>
        </section>
    );
};

export default PaymentSuccess;
