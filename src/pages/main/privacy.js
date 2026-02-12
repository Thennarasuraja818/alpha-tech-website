import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "../../context/TranslationContext";

const PrivacyPage = () => {
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    useEffect(() => {
        AOS.init({ duration: 1000, once: false, mirror: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Helmet>
                <title>Privacy Policy | iLap Training Academy</title>
                <meta name="description" content="Learn how iLap Training Academy collects, uses, and protects your personal data in compliance with UAE and MENA region data protection laws." />
            </Helmet>

            {/* Hero Banner */}
            <section className="Home-banner-3 privacy-banner text-white py-5 position-relative" style={{
                // background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <div className="innerbanner-txt" data-aos="zoom-in" data-aos-delay="200">
                                <h1 className="fw-bold display-4 mb-4">{translateSync('Privacy & Cookies Policy')}</h1>
                                <p className="lead mb-0">{translateSync('How we collect, use, and protect your personal information')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="bg-white rounded-3 shadow-sm p-4 p-md-5" data-aos="fade-up">
                                <div className="mb-4 text-center">
                                    <h2 className="fw-bold mb-3" style={{ color: '#1e40af' }}>{translateSync('Privacy Policy')}</h2>
                                    <div className="divider mx-auto" style={{
                                        width: '80px',
                                        height: '4px',
                                        backgroundColor: '#2563eb',
                                        borderRadius: '2px'
                                    }}></div>
                                </div>

                                {/* Privacy Content */}
                                <div className="privacy-content" style={{ lineHeight: '1.8' }}>
                                    <p className="mb-4">
                                        {translateSync("At iLap Training Academy, we are committed to safeguarding your privacy. We collect, use,and protect your personal data in accordance with data protection laws applicable in the UAE, KSA, and the wider MENA region.")}
                                    </p>
                                    <p className="mb-5">
                                        {translateSync(' By using our website and services, you agree to the collection and use of your information in accordance with this policy.')}
                                    </p>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>1. {translateSync('What Information We Collect')}</h3>
                                        <p className="mb-2">{translateSync('We may collect the following types of data:')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Personal identification information (Name, email address, phone number, etc.)')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Course registration details')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Payment and transaction history')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Browser cookies and usage data')}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>2. {translateSync('How We Use Your Information')}</h3>
                                        <p className="mb-2">{translateSync('Your information helps us to:')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Register and manage your course enrollment')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Provide customer support and respond to inquiries')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Improve our content and services')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Send important updates, promotional materials, and feedback requests (only with your consent)')}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>3. {translateSync('Cookies Policy')}</h3>
                                        <p className="mb-0">
                                            {translateSync("Our website uses cookies to enhance user experience. Cookies are small data files stored on your device to remember preferences and track usage. You can choose to disable cookies through your browser settings, although this may affect the functionality of the site.")}
                                        </p>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>4. {translateSync('Data Security')}</h3>
                                        <p className="mb-0">
                                            {translateSync('We implement industry-standard security measures to protect your data against unauthorized access, alteration, or disclosure.')}
                                        </p>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>5. {translateSync('Third-Party Disclosure')}</h3>
                                        <p className="mb-0">
                                            {translateSync('We do not sell or share your personal data with third parties, except as required to provide  our services or comply with legal obligations.')}
                                        </p>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>6. {translateSync('Your Rights')}</h3>
                                        <p className="mb-2">{translateSync('You have the right to:')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Access your data')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Request corrections')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Withdraw consent or request data deletion')}</span>
                                            </li>
                                        </ul>
                                        <p className="mb-0">
                                            {translateSync('To exercise these rights, contact us at')} <a href="mailto:info@ilap.me" className="text-decoration-none">info@ilap.me</a>.
                                        </p>
                                    </div>

                                    {/* <div className="contact-info bg-light p-4 rounded-3 mt-4">
                                        <h4 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>Contact Information</h4>
                                        <p className="mb-0">
                                            For any questions regarding our privacy practices, please contact us at the email address above or visit our contact page.
                                        </p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PrivacyPage;