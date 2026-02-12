import React, { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ResourcesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000 });
    }, []);

    const resources = [
        {
            title: "Material Compatibility Guide",
            desc: "Comprehensive guide for selecting the right rubber material for your chemical environment.",
            icon: "bi-table"
        },
        {
            title: "O-Ring Size Chart",
            desc: "Standard AS568 and Metric size charts for precision sealing.",
            icon: "bi-aspect-ratio"
        },
        {
            title: "Technical Datasheets",
            desc: "Download detailed PDFs for our proprietary rubber compounds.",
            icon: "bi-file-earmark-pdf"
        },
        {
            title: "Installation Guidelines",
            desc: "Best practices for installing seals to prevent failure.",
            icon: "bi-tools"
        }
    ];

    return (
        <div className="resources-page" style={{ paddingTop: '80px' }}>
            <Helmet>
                <title>Resources | Alpha Technical Rubber Products</title>
            </Helmet>

            {/* Header */}
            <section className="bg-primary text-white py-5 mb-5" style={{ background: 'linear-gradient(rgba(26, 34, 56, 0.9), rgba(26, 34, 56, 0.9)), url(/img/banner-new-3.png) center/cover', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold text-white" data-aos="fade-up">Technical Resources</h1>
                    <p className="fs-5 text-white" data-aos="fade-up" data-aos-delay="100">
                        Engineering data, guides, and tools to support your design.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <div className="container mb-5">
                <div className="row g-4">
                    {resources.map((res, index) => (
                        <div className="col-md-6 col-lg-3" key={index} data-aos="fade-up" data-aos-delay={index * 100} >
                            <div className="card h-100 shadow-sm hover-shadow transition-all text-start p-4" style={{ border: "1px solid #f6993f" }}>
                                <div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-primary" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                    <i className={`bi ${res.icon}`}></i>
                                </div>
                                <h5 className="fw-bold mb-3">{res.title}</h5>
                                <p className=" small mb-4 flex-grow-1">{res.desc}</p>
                                <button className="btn btn-outline-primary btn-sm stretched-link" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                                    Download <i className="bi bi-download ms-2"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Catalog Section */}
            <div className="container mb-5">
                <div className="row bg-light rounded overflow-hidden shadow-sm g-0">
                    <div className="col-md-4">
                        <img src="/img/resource-catalog.png" alt="Catalog" className="img-fluid h-100 object-fit-cover" />
                    </div>
                    <div className="col-md-8 p-5 d-flex flex-column justify-content-center text-start">
                        <h3 className="fw-bold mb-3 text-primary">Download Full Product Catalog</h3>
                        <p className=" mb-4">Get access to our complete range of industrial seals, gaskets, and rubber products with detailed specifications.</p>
                        <div>
                            <button className="btn btn-primary px-4 py-2 fw-bold" style={{ backgroundColor: 'var(--accent-color)', border: 'none' }}>
                                Download PDF Catalog
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
