import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "../../context/TranslationContext";

const TermsPage = () => {
        const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    useEffect(() => {
        AOS.init({ duration: 1000, once: false, mirror: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Helmet>
                <title>Terms & Conditions | iLap Training Academy</title>
                <meta name="description" content="Read iLap Training Academy's terms and conditions for learners regarding intellectual property, code of conduct, certification, and data privacy." />
            </Helmet>

            {/* Hero Banner */}
            <section className="Home-banner-3 text-white py-5 position-relative" style={{
                // background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <div className="innerbanner-txt" data-aos="zoom-in" data-aos-delay="200">
                                <h1 className="fw-bold display-4 mb-4">{translateSync('Terms & Conditions')}</h1>
                                <p className="lead mb-0">{translateSync('Guidelines and policies for iLap Training Academy learners')}</p>
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
                                    <h2 className="fw-bold mb-3" style={{ color: '#1e40af' }}>{translateSync('iLap Terms & Conditions for Learners')}</h2>
                                    <div className="divider mx-auto" style={{
                                        width: '80px',
                                        height: '4px',
                                        backgroundColor: '#2563eb',
                                        borderRadius: '2px'
                                    }}></div>
                                </div>

                                {/* Terms Content */}
                                <div className="terms-content" style={{ lineHeight: '1.8' }}>
                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>1. {translateSync('Intellectual Property')}</h3>
                                        <p className="mb-0">
                                           {translateSync(' All learning materials are copyrighted and are the intellectual property of iLap Training Academy.Unauthorized sharing or reproduction is strictly prohibited.')}
                                        </p>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>2. {translateSync('Learner Code of Conduct')}</h3>
                                        <p className="mb-2">{translateSync('To maintain a high-quality learning environment, all learners are expected to:')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Attend sessions punctually and actively participate')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Respect trainers and fellow participants')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Maintain professional behavior during all interactions')}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>3. {translateSync('Certification Eligibility')}</h3>
                                        <p className="mb-2">{translateSync('To receive a Certificate of Completion, participants must:')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Attend at least 80% of the course duration')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Complete all required assignments or assessments')}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>4. {translateSync('Program Schedule & Instructor Changes')}</h3>
                                        <p className="mb-2">{translateSync('iLap Training Academy reserves the right to:')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Update course schedules, delivery formats, or locations')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Replace instructors with equally qualified professionals')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Cancel underbooked sessions with full refunds or alternative options')}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-5">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>5. {translateSync('Data Privacy')}</h3>
                                        <p className="mb-0">
                                            {translateSync("We are committed to protecting your data. All personal information will be used strictly for course communication, enrollment, and certification purposes in compliance with data privacy laws in the UAE and GCC.")}
                                        </p>
                                    </div>

                                    <div className="contact-info bg-light p-4 rounded-3">
                                        <h3 className="mb-3 fw-semibold" style={{ color: '#1e40af' }}>{translateSync('Contact iLap Training Academy')}</h3>
                                        <p className="mb-3">{translateSync('Have a question about our cancellation or refund policy?')}</p>
                                        <ul className="list-unstyled">
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Email')}: <a href="mailto:info@ilap.me" className="text-decoration-none">info@ilap.me</a></span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Phone: +971 4 88 35 988 | +971 50 255 0228')}</span>
                                            </li>
                                            <li className="d-flex mb-2">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Head Office: Dubai, UAE')}</span>
                                            </li>
                                            <li className="d-flex">
                                                <span className="me-2" style={{ color: '#2563eb' }}>•</span>
                                                <span>{translateSync('Business Hours: Monday – Friday | 9:00 AM – 5:00 PM')}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TermsPage;