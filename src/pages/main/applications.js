import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ApplicationsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000 });
    }, []);

    const applications = [
        {
            title: "Oil & Gas",
            description: "Sealing, protection, and wear solutions for harsh field and plant conditions. Our elastomers are designed to withstand explosive decompression and aggressive sour gas environments.",
            image: "/img/banner-new-2.png",
            features: ["Harsh Field Protection", "Wear Solutions", "High Pressure Sealing"]
        },
        {
            title: "Refineries",
            description: "Engineered products for process integrity, maintenance efficiency, and safer shutdowns. We provide critical sealing for pumps, valves, and mechanical seals.",
            image: "/img/banner-new-1.png",
            features: ["Process Integrity", "Maintenance Efficiency", "Safer Shutdowns"]
        },
        {
            title: "Petrochemical",
            description: "Chemical-compatible rubber solutions for sealing, handling, and long service life. Our compounds resist aggressive solvents, acids, and bases found in petrochemical plants.",
            image: "/img/banner-new-3.png",
            features: ["Chemical Compatibility", "Safe Handling", "Long Service Life"]
        },
        {
            title: "Chemical Processing",
            description: "Linings and elastomers engineered for chemical compatibility and longevity. Specialized formulations to prevent corrosion and leakage in aggressive media.",
            image: "/img/product-category-2.png",
            features: ["Corrosion Resistant Linings", "Chemical Compatibility", "Extended Longevity"]
        },
        {
            title: "Steel & Metal Processing",
            description: "High-performance rubber for conveyors, impact areas, sealing, and plant systems. Impact-resistant solutions that reduce noise and wear in heavy processing lines.",
            image: "/img/product-category-4.png",
            features: ["Conveyor Systems", "Impact Resistance", "Plant System Sealing"]
        },
        {
            title: "Aluminum",
            description: "Elastomers supporting processing lines, chemical exposure areas, and mechanical interfaces. Custom profiles for pot room insulation and anode sealing.",
            image: "/img/product-category-3.png",
            features: ["Processing Line Support", "Chemical Exposure Resistance", "Mechanical Interfaces"]
        },
        {
            title: "Manufacturing & MRO",
            description: "Custom rubber parts made to spec for fast replacement and reduced downtime. Reverse engineering and rapid prototyping for obsolete or hard-to-find parts.",
            image: "/img/product-custom-rubber.png",
            features: ["Custom Fabrication", "Fast Replacement", "Reduced Downtime"]
        }
    ];

    return (
        <div className="applications-page" style={{ paddingTop: '80px' }}>
            <Helmet>
                <title>Applications | Alpha Technical Rubber Products</title>
                <meta name="description" content="Rubber solutions for Oil & Gas, Refineries, Petrochemical, and Heavy Industries." />
            </Helmet>

            {/* Header */}
            <section className="bg-primary text-white py-5 mb-5" style={{ background: 'linear-gradient(rgba(26, 34, 56, 0.9), rgba(26, 34, 56, 0.9)), url(/img/banner-2.jpg) center/cover', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold text-white" data-aos="fade-up">Heavy Industry Applications</h1>
                    <p className="fs-5 text-white" data-aos="fade-up" data-aos-delay="100">
                        Engineering solutions for the world's most demanding sectors.
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <div className="container mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center" data-aos="fade-up">
                        <div className="mx-auto mb-4" style={{ height: '3px', width: '80px', backgroundColor: 'var(--accent-color)' }}></div>
                        <h4 className="fw-bold mb-4 text-primary">Engineered for Extremes</h4>
                        <p className="" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                            Products built for demanding industrial environments, where heat, abrasion, chemicals, and continuous operations prevail. We support these sectors with rubber solutions that help <span className="fw-bold text-dark">protect equipment, reduce wear, and extend service life.</span> From plant maintenance to critical production areas, our focus is on durability, safety, and reliability under harsh conditions.
                        </p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="container mb-5">
                {applications.map((app, index) => (
                    <div className="row mb-5 align-items-center g-5" key={index} data-aos="fade-up">
                        <div className={`col-md-6 ${index % 2 !== 0 ? 'order-md-2' : ''}`}>
                            <div className="position-relative overflow-hidden rounded shadow-lg border border-light">
                                <img src={app.image} alt={app.title} className="img-fluid w-100" style={{ height: '350px', objectFit: 'cover' }} />
                                <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-to-t from-black to-transparent p-3 d-md-none">
                                    <h5 className="text-white mb-0">{app.title}</h5>
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-6 text-start ${index % 2 !== 0 ? 'order-md-1' : ''}`}>
                            <h2 className="fw-bold mb-3 text-primary">{app.title}</h2>
                            <div className="mb-4" style={{ height: '3px', width: '60px', backgroundColor: 'var(--accent-color)' }}></div>
                            <p className=" mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>{app.description}</p>
                            <h6 className="fw-bold text-uppercase mb-3 text-primary">Key Applications & Features:</h6>
                            <ul className="list-unstyled">
                                {app.features.map((feat, i) => (
                                    <li className="d-flex align-items-center mb-2" key={i}>
                                        <i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--accent-color)' }}></i>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationsPage;
