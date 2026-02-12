import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "../../context/TranslationContext";

const AboutPage = () => {
    const navigate = useNavigate();
    const { translateSync } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div style={{ paddingTop: '80px' }}>
            <Helmet>
                <title>About Us | Alpha Technical Rubber Products</title>
                <meta name="description" content="Leading manufacturer of high-performance rubber seals and custom molded parts for industrial applications." />
            </Helmet>

            {/* 1. Hero Banner */}
            <section className="text-white py-5 position-relative" style={{ background: 'linear-gradient(rgba(26, 34, 56, 0.9), rgba(26, 34, 56, 0.9)), url(/img/banner-1.jpg) center/cover', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                    <h1 className="fw-bold display-4 mb-3 text-white" data-aos="fade-up">About Alpha Tech</h1>
                    <p className="lead mb-0 text-white-100" data-aos="fade-up" data-aos-delay="100">Precision Engineering. Global Standards. Trusted Solutions.</p>
                </div>
            </section>

            {/* 2. Company Profile */}
            <section className="py-5 bg-white">
                <div className="container py-4">
                    <div className="row align-items-start g-5">
                        <div className="col-lg-6 text-start" data-aos="fade-right">
                            <h5 className="text-primary fw-bold text-uppercase mb-3">Who We Are</h5>
                            <h2 className="fw-bold mb-4 display-6 text-primary">Excellence in Rubber Manufacturing Since 2005</h2>
                            <div className="mb-4" style={{ height: '4px', width: '60px', backgroundColor: 'var(--accent-color)' }}></div>
                            <p className="fs-5 text-dark mb-4 fw-normal" style={{ textAlign: 'justify' }}>
                                Alpha Technical Rubber Products is a premier manufacturer specializing in high-performance hydraulic, pneumatic, and rotary seals.
                            </p>
                            <p className="text-dark mb-4 lh-lg" style={{ textAlign: 'justify' }}>
                                With over two decades of experience, we serve heavy industries across the globe, providing critical sealing solutions that ensure operational efficiency and safety. Our state-of-the-art facility in Bahrain utilizes advanced molding technologies to deliver products that meet strict international standards including ISO 9001:2015.
                            </p>

                            {/* <div className="d-flex justify-content-center gap-5 mb-4 flex-wrap">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="bg-light rounded-circle p-3 mb-3 text-primary">
                                        <i className="bi bi-globe fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0">Global Reach</h6>
                                        <small className="text-muted">Exporting to 20+ Countries</small>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div className="bg-light rounded-circle p-3 mb-3 text-primary">
                                        <i className="bi bi-award fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0">Certified Quality</h6>
                                        <small className="text-muted">ISO 9001:2015 Accredited</small>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary px-4 py-2" style={{ backgroundColor: 'var(--accent-color)', border: 'none' }} onClick={() => navigate('/contact')}>
                                Contact Our Team
                            </button> */}
                        </div>
                        <div className="col-lg-6" data-aos="zoom-in">
                            <div className="position-relative">
                                <img src="/img/about-new-side.png" alt="Factory Interior" className="img-fluid rounded shadow-lg" />
                                <div className="position-absolute bottom-0 start-0 bg-white p-4 m-4 rounded shadow d-none d-md-block" style={{ maxWidth: '250px' }}>
                                    <h3 className="fw-bold text-primary mb-0">20+</h3>
                                    <p className="mb-0 text-muted small">Years of Engineering Excellence</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Core Values */}
            <section className="py-5 bg-light">
                <div className="container py-4">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h2 className="fw-bold text-primary">Our Core Values</h2>
                        <p className=" fw-normal">The principles that drive our innovation and success.</p>
                    </div>
                    <div className="row g-4">
                        {[
                            { title: "Innovation", icon: "bi-lightbulb", desc: "Constantly evolving our manufacturing processes to meet modern industrial challenges." },
                            { title: "Integrity", icon: "bi-shield-lock", desc: "Building trust through transparent business practices and reliable product performance." },
                            { title: "Quality", icon: "bi-star", desc: "Uncompromising standards in every seal we produce, backed by rigorous testing." },
                            { title: "Customer Focus", icon: "bi-people", desc: "Tailoring solutions to meet the specific technical needs of our clients." }
                        ].map((val, idx) => (
                            <div className="col-md-6 col-lg-3" key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                                <div className="card h-100 shadow-sm text-center p-4 hover-lift" style={{ border: "1px solid #f6993f" }}>
                                    <div className="mb-3 text-primary fs-1">
                                        <i className={`bi ${val.icon}`}></i>
                                    </div>
                                    <h5 className="fw-bold mb-3">{val.title}</h5>
                                    <p className=" small mb-0">{val.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Certifications CTA */}
            <section className="py-5 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8 text-center text-md-start mb-4 mb-md-0">
                            <h3 className="fw-bold mb-2 text-white">ISO 9001:2015 Certified Manufacturer</h3>
                            <p className="mb-0 text-white">We adhere to the highest international standards of quality management.</p>
                        </div>
                        <div className="col-md-4 text-center text-md-end">
                            <button className="btn btn-light px-4 py-2 fw-bold text-primary" onClick={() => navigate('/resources')}>
                                View Certificates
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;