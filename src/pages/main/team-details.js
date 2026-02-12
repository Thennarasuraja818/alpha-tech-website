import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiProvider from "../../apiProvider/api";
import { IMAGE_URL } from "../../network/apiClient";
import { useTranslation } from "../../context/TranslationContext";
import { Helmet } from 'react-helmet-async';

const TeamDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    const [managementDetailData, setManagementDetailData] = useState([]);

    // Function to translate HTML content while preserving structure
    const translateHTMLContent = (html) => {
        if (!html) return "";
        
        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Extract all text nodes and translate them
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        const nodesToTranslate = [];
        
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                nodesToTranslate.push(node);
            }
        }
        
        // Translate each text node
        nodesToTranslate.forEach(node => {
            const translatedText = translateSync(node.textContent);
            node.textContent = translatedText;
        });
        
        return tempDiv.innerHTML;
    };

    const fetchData = async () => {
        try {
            const result = await apiProvider.getManagementTeamsDetail(slug);
            if (result) {
                setManagementDetailData(result.response.data.data);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Helmet>
                <title>Confidence building courses in dubai | iLap Training</title>
                <meta
                    name="keywords"
                    content="document controller course, train the trainer, courses in abu dhabi, recruitment and interviewing skills training, public speaking courses, certified financial courses, certified contract manager certification"
                />
            </Helmet>

            <div>
                <section className="Home-banner-3  text-white py-5 position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center  home-header" >
                            <div className="innerbanner-txt " data-aos="zoom-in" data-aos-delay="200">
                                <h1 className="fw-bold text-center display-5  font-51">{translateSync('Our Visionary Management Team')}</h1>
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a>{translateSync('About')}</a></li>
                                    <li class="breadcrumb-item" onClick={() => navigate("/team")}>{translateSync('Management Team')}</li>  
                                    <li class="breadcrumb-item active">{translateSync(managementDetailData.name)}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="training-transforms-section py-5 ">
                    <div className="container">
                        <div className="row align-items-stretch">
                            <div className="col-md-6 d-flex align-items-stretch left-side-img" data-aos="fade-right" data-aos-delay="200">
                                <img
                                    src={IMAGE_URL + managementDetailData.image}
                                    alt="Training"
                                    className="img-fluid  w-100 h-100 object-fit-cover"
                                />
                            </div>

                            <div className="col-md-6 text-left  justify-content-between" data-aos="fade-left" data-aos-delay="200">
                                <div className="aboutpage-content neww teamname-area" data-aos="fade-up" data-aos-delay="400">
                                    <h2 className="fw-bold text-left mb-2 text-black font-18" data-aos="fade-up" data-aos-delay="400">
                                        {translateSync(managementDetailData.name)}
                                    </h2>
                                    <h5 className="mb-4" data-aos="fade-up" data-aos-delay="400">
                                        <span>{translateSync(managementDetailData.designation)}</span>
                                    </h5>

                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: translateHTMLContent(managementDetailData.description),
                                        }}
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default TeamDetailPage;