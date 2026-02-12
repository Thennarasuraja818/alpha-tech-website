
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";

const FooterPage = () => {
    const { translateSync } = useTranslation();

    return (
        <footer className="industrial-footer">
            <div className="container pt-5 pb-3">
                <div className="row g-5 text-start">
                    {/* 1. Left: Company Info */}
                    <div className="col-lg-4 col-md-6">
                        <Link to="/" className="d-block mb-4 text-decoration-none ps-0">
                            <img
                                src="/img/alpha-logo.png"
                                alt="ALPHA Technical Rubber Sheets"
                                style={{ height: '70px', objectFit: 'contain' }}
                            />
                        </Link>
                        <p className="footer-company-desc mb-4 text-start">
                            Specializing in high-performance rubber products for industrial applications since 2005. We deliver quality, durability, and innovation for demanding industries worldwide.
                        </p>

                        <div className="social-icons d-flex gap-3 justify-content-start" style={{ paddingTop: "15px" }}>
                            <a href="#" className="social-btn facebook"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="social-btn twitter"><i className="bi bi-twitter-x"></i></a>
                            <a href="#" className="social-btn linkedin"><i className="bi bi-linkedin"></i></a>
                            <a href="#" className="social-btn youtube"><i className="bi bi-youtube"></i></a>
                        </div>
                    </div>

                    {/* 2. Quick Links - Matching Header */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="footer-heading mb-4 text-start">Quick Links</h5>
                        <ul className="list-unstyled footer-links text-start">
                            <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
                            <li><Link to="/products" onClick={() => window.scrollTo(0, 0)}>Products</Link></li>
                            <li><Link to="/about" onClick={() => window.scrollTo(0, 0)}>About Us</Link></li>
                            <li><Link to="/applications" onClick={() => window.scrollTo(0, 0)}>Applications</Link></li>
                            <li><Link to="/resources" onClick={() => window.scrollTo(0, 0)}>Resources</Link></li>
                            <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)}>Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* 3. Global Headquarters (Address) */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="footer-heading mb-4 text-start">Headquarters</h5>
                        <ul className="list-unstyled footer-contact text-start">
                            <li className="d-flex mb-3 align-items-start">
                                <i className="bi bi-geo-alt-fill mt-1 me-3 flex-shrink-0"></i>
                                <span>
                                    Alpha Technical Rubber Sheets W.L.L<br />
                                    Bldg 123, Road 456, Block 789<br />
                                    Manama, Kingdom of Bahrain
                                </span>
                            </li>
                            <li className="d-flex mb-3 align-items-center">
                                <i className="bi bi-telephone-fill me-3 flex-shrink-0"></i>
                                <span>+973 1700 6820</span>
                            </li>
                            <li className="d-flex mb-3 align-items-center">
                                <i className="bi bi-envelope-fill me-3 flex-shrink-0"></i>
                                <span>sales@alphatechrubber.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="footer-heading mb-4 text-start">Stay Updated</h5>
                        <p className=" small mb-4 text-start">Subscribe to our newsletter for the latest product updates and industry insights.</p>
                        <form className="mb-4 position-relative">
                            <input
                                type="email"
                                className="form-control form-control-lg pe-5"
                                placeholder="Your Email Address"
                                aria-label="Email"
                                style={{ borderRadius: '4px', fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}
                            />
                            <button
                                className="btn position-absolute top-0 end-0 h-100 px-3"
                                type="submit"
                                style={{ border: 'none', background: 'transparent', color: 'var(--accent-color)' }}
                            >
                                <i className="bi bi-arrow-right fs-5"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom mt-4 border-top">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-0  small">
                                &copy; {new Date().getFullYear()} Alpha Technical Rubber Products. All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                            <ul className="list-inline mb-0 small">
                                <li className="list-inline-item"><a href="#" className=" text-decoration-none">Privacy Policy</a></li>
                                <li className="list-inline-item mx-2 ">|</li>
                                <li className="list-inline-item"><a href="#" className=" text-decoration-none">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterPage;