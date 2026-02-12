import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import apiProvider from "../../apiProvider/api";
import { IMAGE_URL } from "../../network/apiClient";

import { Helmet } from 'react-helmet-async';
import { useTranslation } from "../../context/TranslationContext";


const FacilitatorDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    const [facilitatorDetailData, setFacilitatorDetailData] = useState([])

    // setFacilitatorDetailData
    // console.log(slug, "slug");

    const fetchData = async () => {
        try {

            const result = await apiProvider.getFacilitorDetail(slug);
            console.log(result, "result-fac");
            if (result) {
                setFacilitatorDetailData(result.response.data.data);
            }

        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    console.log(facilitatorDetailData, "facilitatorDetailData");

    return (
        <>

            <Helmet>
                <title>Advanced facilities management llct | iLap Training</title>
                <meta
                    name="keywords"
                    content="كيفية التعامل مع كبار الشخصيات, certified risk management specialist, atd membership cost, lead consult abu dhabi, technical training courses in abu dhabi, competency certificate, operations management course"
                />

            </Helmet>
            <div>

                <section className="Home-banner-3  text-white py-5 position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center home-header" >
                            <div className="innerbanner-txt " data-aos="zoom-in" data-aos-delay="200">
                                <h1 className="fw-bold text-center display-5  font-51">{translateSync('Our Facilitators')}</h1>
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a title="" >{translateSync('About')}</a></li>
                                    <li class="breadcrumb-item " onClick={() => navigate("/facilitator")}>{translateSync('Our Facilitators')}</li>
                                    <li class="breadcrumb-item active">{translateSync(facilitatorDetailData.name) || ""}</li>
                                </ol>
                            </div>

                        </div>

                    </div>
                </section>




                {/* Training That Transforms Section */}
                <section className="training-transforms-section py-5 ">
                    <div className="container">
                        {/* Section Title */}
                        {/* <h2 className="fw-bold text-center text-bg-light-color">Training That Transform</h2>
                    <p className="text-center px-md-5 mb-4">
                        Our programs go beyond traditional learning by combining cutting-edge strategies,
                        real-world applications, and expert guidance to create lasting impact.
                    </p> */}

                        <div className="row align-items-stretch">
                            {/* Left Side - Image (Full Height) */}
                            <div className="col-md-6 d-flex align-items-stretch left-side-img" data-aos="fade-right" data-aos-delay="200">
                                <img
                                    src={IMAGE_URL + facilitatorDetailData.image}
                                    alt="Training"
                                    className="img-fluid  w-100 h-100 object-fit-cover"
                                />
                            </div>

                            {/* Right Side - List Items (Full Height) */}
                            <div className="col-md-6 text-left  justify-content-between">

                                <div className="aboutpage-content neww teamname-area">
                                    <h2 className="fw-bold text-left mb-2 text-black font-18" data-aos="zoom-in" data-aos-delay="200">{translateSync(facilitatorDetailData.name) || ""}</h2>
                                    <h5 className="mb-4" data-aos="zoom-in" data-aos-delay="300"><span>{translateSync(facilitatorDetailData.designation)}</span></h5>

                                    <h6 data-aos="fade-up" data-aos-delay="200">{translateSync('Background')}</h6>

                                    <p data-aos="fade-up" data-aos-delay="400">{translateSync(facilitatorDetailData.background) || ""}.</p>
                                    <h6 data-aos="fade-up" data-aos-delay="600">{translateSync('Experience')}</h6>

                                    <p data-aos="fade-up" data-aos-delay="800">{translateSync(facilitatorDetailData.experience) || ""}</p>
                                </div>
                            </div>
                        </div>




                        <div className="justify-content-center align-items-center py-4 pt-5 expertise-area-portion">
                            <div className="bglightcolor text-white rounded-3 shadow-lg p-4 d-flex area-content-fd">
                                {/* Left Section */}
                                <div className="quarter-part pe-4">
                                    <h2 className="fw-semibold mb-3" data-aos="zoom-in" data-aos-delay="200">{translateSync("Areas of Expertise")}</h2>
                                    <ul className="list-unstyled" data-aos="fade-up" data-aos-delay="300">
                                        {facilitatorDetailData.expertise && facilitatorDetailData.expertise &&
                                            JSON.parse(facilitatorDetailData.expertise).map((ival) => {
                                                return (
                                                    <li><span>•</span> {translateSync(ival)}</li>
                                                )
                                            }
                                            )
                                        }
                                        {/* <li><span>•</span> Leadership & Management Training</li>
                                        <li><span>•</span> Performance Management</li>
                                        <li><span>•</span> Career Planning & Talent Management</li>
                                        <li><span>•</span> Change Management</li> */}
                                    </ul>
                                </div>

                                {/* Divider */}
                                <div className="border-end facidet border-white mx-3"></div>

                                {/* Right Section */}
                                <div className="fullyy-part w-60 ps-4">
                                    <h2 className="fw-semibold mb-3" data-aos="zoom-in" data-aos-delay="200">{translateSync('Certification and Awards')}</h2>
                                    <ul className="list-unstyled" data-aos="zoom-in" data-aos-delay="300">
                                        {facilitatorDetailData.certificates && facilitatorDetailData.certificates &&
                                            JSON.parse(facilitatorDetailData.certificates).map((ival) => {
                                                return (
                                                    <li><span>•</span> {translateSync(ival)}</li>
                                                )
                                            }
                                            )
                                        }
                                        {/* <li><span>•</span> Chartered Institute of Personnel and Development (CIPD) – Level 5</li> */}
                                        {/* <li><span>•</span> International Business Driving License (IBDL)</li>
                                        <li><span>•</span> Microsoft Certified System Engineer (MCSE 2003)</li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>



                        <div className=" justify-content-center align-items-center py-4 expertise-area-mob">
                            <div className="bglightcolor text-white rounded-3 shadow-lg p-4 area-content-fd">
                                {/* Left Section */}
                                <div className="quarter-part pe-4">
                                    <h2 className="fw-semibold mb-3">{translateSync('Areas of Expertise')}</h2>
                                    <ul className="list-unstyled">
                                        {facilitatorDetailData.expertise && facilitatorDetailData.expertise &&
                                            JSON.parse(facilitatorDetailData.expertise).map((ival) => {
                                                return (
                                                    <li><span>•</span> {translateSync(ival)}</li>
                                                )
                                            }
                                            )
                                        }
                                        {/* <li><span>•</span> Leadership & Management Training</li>
                                        <li><span>•</span> Performance Management</li>
                                        <li><span>•</span> Career Planning & Talent Management</li>
                                        <li><span>•</span> Change Management</li> */}
                                    </ul>
                                </div>

                                {/* Divider */}
                                <div className="border-end facidet border-white mx-3"></div>

                                {/* Right Section */}
                                <div className="fullyy-part w-60 ps-4">
                                    <h2 className="fw-semibold mb-3">{translateSync('Certification and Awards')}</h2>
                                    <ul className="list-unstyled">
                                        {facilitatorDetailData.certificates && facilitatorDetailData.certificates &&
                                            JSON.parse(facilitatorDetailData.certificates).map((ival) => {
                                                return (
                                                    <li><span>•</span> {translateSync(ival)}</li>
                                                )
                                            }
                                            )
                                        }
                                        {/* <li><span>•</span> Chartered Institute of Personnel and Development (CIPD) – Level 5</li> */}
                                        {/* <li><span>•</span> International Business Driving License (IBDL)</li>
                                        <li><span>•</span> Microsoft Certified System Engineer (MCSE 2003)</li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>




            </div>

        </>
    )
}

export default FacilitatorDetailPage;