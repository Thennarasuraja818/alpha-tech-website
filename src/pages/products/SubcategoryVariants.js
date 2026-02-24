import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import categoryData from '../../data/categories.json'; // To get titles/images if needed
import subcategoryVariants from '../../data/subcategoryVariants.json';
import HomeApi from '../../apiProvider/homeApi';
import { IMAGE_URL } from '../../network/apiClient';

const SubcategoryVariants = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { translateSync } = useTranslation();
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    // const getChildCategoryList = async () => {
    //     try {
    //         const response = await HomeApi.childCategoryList({ subCategoryId });
    //         console.log("responce :", response);
    //         if (response.status) {
    //             setChildCategoryList(response.response.data);
    //             if (response.response.subCategory) {
    //                 setApiSubCategoryName(response.response.subCategory.name);
    //             }
    //         }
    //     } catch (error) {
    //         console.log("error :", error);
    //     }
    // }

    const fetchSubCategories = async () => {
        try {
            const params = {
                category: categoryId,
                limit: 100
            }
            const response = await HomeApi.subCategoryList(params)
            if (response.status) {
                const data = response.response;
                if (data?.data?.items && Array.isArray(data?.data?.items)) {
                    setSubCategoryList(data?.data?.items);
                    if (data.data.items.length > 0 && data.data.items[0].category?.[0]?.name) {
                        setCategoryName(data.data.items[0].category[0].name);
                    }
                } else {
                    console.error("Subcategories API returned non-array:", data?.data?.items);
                    setSubCategoryList([]);
                }
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setSubCategoryList([]);
        }
    }

    useEffect(() => {
        // getChildCategoryList();
        fetchSubCategories();
        window.scrollTo(0, 0);
    }, [categoryId]);
    return (
        <div className="subcategory-variants-page" style={{ marginTop: '100px', minHeight: '60vh', paddingBottom: '50px' }}>
            <div className="container">

                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-primary display-5 mb-3">
                        {categoryName || "Category"}
                    </h1>
                    <div style={{ height: '4px', width: '80px', backgroundColor: 'var(--accent-color)', margin: '0 auto', borderRadius: '2px' }}></div>
                    <p className="lead mt-3 text-secondary">
                        {translateSync(`Explore our ${categoryName || 'industrial'} range and technical specifications.`)}
                    </p>
                </div>

                {/* Variants Grid */}
                {subCategoryList && subCategoryList.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4 justify-content-center">
                        {subCategoryList.map((sub) => {
                            const image = sub.images?.[0];
                            const imageUrl = image
                                ? `${IMAGE_URL}/${image.docPath}/${image.docName}`
                                : '';

                            return (
                                <div className="col" key={sub._id}>
                                    <div
                                        className="card h-100 shadow-sm hover-lift cursor-pointer"
                                        onClick={() => navigate(`/products/${categoryId}/${sub._id}`)}
                                        style={{ transition: 'all 0.3s ease', cursor: 'pointer', border: '2px solid var(--accent-color)' }}
                                    >
                                        <div className="card-body p-4 text-center d-flex flex-column align-items-center">
                                            {/* Image or Icon */}
                                            <div className="mb-4 d-flex align-items-center justify-content-center"
                                                style={{ height: '120px', width: '100%' }}>
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={sub.name} style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                                                        style={{ width: '80px', height: '80px', backgroundColor: '#e3f2fd', color: 'var(--primary-color)' }}>
                                                        <i className="bi bi-layers-half fs-1"></i>
                                                    </div>
                                                )}
                                            </div>

                                            <h5 className="card-title fw-bold text-dark">{sub.name}</h5>
                                            {sub.description && (
                                                <p className="card-text text-muted small">{sub.description.substring(0, 60)}...</p>
                                            )}

                                            <button className="btn btn-sm mt-auto rounded-pill px-4 view-specs-btn" style={{ fontWeight: '600' }}>
                                                {translateSync('View Specs')} <i className="bi bi-arrow-right ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <div className="alert alert-info">
                            {translateSync('No specific variants found for this category. View all products directly.')}
                        </div>
                        <button onClick={() => navigate(`/products/${categoryId}/all`)} className="btn btn-primary">
                            {translateSync('View All Products')}
                        </button>
                    </div>
                )}
            </div>

            <style>
                {`
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .view-specs-btn {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    transition: background-color 0.3s ease;
                }
                .view-specs-btn:hover {
                    background-color: var(--accent-color);
                    color: white;
                }
                `}
            </style>
        </div>
    );
};

export default SubcategoryVariants;
