import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import categoryData from '../../data/categories.json';

const ProductsMain = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Helper to get image based on subcategory ID (mappings based on typical file naming or available assets)
    const getProductImage = (subId) => {
        const imageMap = {
            'o-rings': '/img/product-category-1.png',
            'oil-seals': '/img/product-category-2.png',
            'hydraulic-seals': '/img/product-category-3.png',
            'rubber-sheets': '/img/product-rubber-sheets.png',
            'mats': '/img/product-rubber-mats.png',
            'custom-rubber': '/img/product-custom-rubber.png',
            'corner-guards': '/img/bps-corner-guard.png',
            'wheel-stoppers': '/img/bps-wheel-stopper.png',
            'speed-humps': '/img/bps-speed-hump.png',
            'wall-guards': '/img/bps-wall-guard.png'
        };
        return imageMap[subId] || '/img/product-seal-1.png'; // Fallback
    };

    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Helmet>
                <title>Products | Alpha Technical Rubber Products</title>
                <meta name="description" content="Explore our wide range of industrial rubber products, seals, and safety solutions." />
            </Helmet>

            {/* Hero Section */}
            <section className="text-white py-5 position-relative" style={{ background: 'linear-gradient(rgba(26, 34, 56, 0.9), rgba(26, 34, 56, 0.9)), url(/img/products-banner.png) center/cover', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="container text-center">
                    <h1 className="fw-bold display-4 mb-3 text-white">Our Product Range</h1>
                    <p className="lead mb-0 text-white-100 mx-auto" style={{ maxWidth: '700px' }}>
                        High-performance sealing solutions, industrial rubber products, and safety systems designed for durability and precision.
                    </p>
                </div>
            </section>

            <div className="container py-5">
                {categoryData.map((category) => (
                    <div key={category.id} className="mb-5">
                        <div className="d-flex flex-column align-items-center mb-4 border-bottom pb-4 text-center">
                            <div className="bg-white p-3 rounded-circle shadow-sm mb-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                <i className={`bi ${category.icon} fs-3`}></i>
                            </div>
                            <div>
                                <h2 className="fw-bold text-primary mb-2 h3">{category.title}</h2>
                                <p className="text-muted mb-0 small">{category.description}</p>
                            </div>
                        </div>

                        <div className="row justify-content-center g-4">
                            {category.subcategories.map((sub) => (
                                <div className="col-md-6 col-lg-3" key={sub.id}>
                                    <Link to={`/products/${sub.id}`} className="text-decoration-none h-100">
                                        <div className="card h-100 shadow-sm hover-card transition-all" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--accent-color)' }}>
                                            <div className="card-img-top bg-white p-3 d-flex align-items-center justify-content-center border-bottom" style={{ height: '180px' }}>
                                                <img
                                                    src={getProductImage(sub.id)}
                                                    alt={sub.name}
                                                    className="img-fluid"
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                                                />
                                            </div>
                                            <div className="card-body bg-white p-3 text-center">
                                                <h5 className="fw-bold text-dark mb-3">{sub.name}</h5>
                                                <span className="btn btn-sm btn-industrial-primary product-btn">View Products</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .hover-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                }
                .hover-card:hover img {
                    transform: scale(1.08);
                }
                .product-btn {
                    padding: 8px 16px !important;
                    font-size: 0.8rem !important;
                }
            `}</style>
        </div>
    );
};

export default ProductsMain;
