import React, { useState, useEffect } from "react";
import apiProvider from "../../apiProvider/api";
import { IMAGE_URL } from "../../network/apiClient";
import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "../../context/TranslationContext";

import AOS from 'aos';
import 'aos/dist/aos.css';
const ProfileGrid = () => {
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    const [manageMentTeamData, setManageMentTeamData] = useState([]);
    const navigate = useNavigate();



    const facilitators = [
        {
            name: "Eslam Ghonem",
            title: "Learning & Development Expert",
            image: "/img/faci-one.png",
        },
        {
            name: "Dr. Adel Iskandar",
            title: "Certified Trainer",
            image: "/img/faci-two.png",
        },
        {
            name: "Hesham Elansari",
            title: "Learning & Development Facilitator",
            image: "/img/faci-three.png",
        },
        {
            name: "Yasser Al–Fahad",
            title: "Consultant HRD",
            image: "/img/faci-four.png",
        },

    ];

    const fetchData = async () => {
        try {
            const result = await apiProvider.getManagementTeams();
            console.log(result, "result-fac");
            if (result) {
                setManageMentTeamData(result.response.data.data);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,     // animation duration
            once: false,        // allow animation every time the element is in view
            mirror: true        // animate out while scrolling past
        });
    }, []);



    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const readMore = (data) => {
        console.log(data, "dataaaaaaaa.slug");
        navigate(`/team-details/${data.slug}`)

    }
    const profiles = [
        { image: "/img/team-one.png", name: "Fathima Nazeeha", designation: "CEO iLap Training Academy" },
        { image: "/img/team-one.png", name: "John Doe", designation: "CTO iLap Solutions" },
        { image: "/img/team-one.png", name: "Jane Smith", designation: "Lead Trainer" }
    ];

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Helmet>
                <title>Afaq for leadership development | iLap Training</title>
                <meta
                    name="keywords"
                    content="ادارة المشاريع, project management courses, leadership coaching dubai, data driven decision making course, training courses near me, management training courses, compliance courses, performance management training KSA"
                />

            </Helmet>


            <div>

                <section className="Home-banner-3  text-white py-5 position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center  home-header" data-aos="zoom-in" data-aos-delay="200">
                            <div className="innerbanner-txt ">
                                <h1 className="fw-bold text-center display-5  font-51">{translateSync('Our Visionary Management Team')}</h1>
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a>{translateSync('About')}</a></li>
                                    <li class="breadcrumb-item active" onClick={() => navigate("/team")}>{translateSync('Management Team')}</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <div className="container mt-5 py-5">
                <div className="row">
                    {manageMentTeamData.map((profile, index) => (

                        <div className="col-md-4 d-flex justify-content-center mb-4" key={index}>
                            <div className="position-relative overflow-hidden rounded-4 shadow-lg">
                                <img src={IMAGE_URL + profile.image} alt={profile.name} className="img-fluid rounded-4 w-100" />


                                <div
                                    className="position-absolute bottom-0 start-50 translate-middle-x text-white text-center bg-darkk bg-opacity-75 p-3 w-90 rounded-3"
                                    style={{ marginBottom: "20px", lineHeight: "30px" }}>
                                    <h5 className="fw-bold mb-1">{profile.name}</h5>
                                    <p className="mb-1">{profile.designation}</p>
                                    <a style={{ cursor: "pointer" }} className="text-white fw-bold" onClick={() => readMore(profile)}>Read More</a>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div> */}

                <div className="container mt-5 py-5">
                    <div className="row">
                        {manageMentTeamData.map((profile, index) => {

                            if (index != 3) {
                                return (
                                    <div className="col-md-4 d-flex justify-content-center mb-4" key={index} data-aos="fade-up"
                                        data-aos-delay={`${index * 100}`}
                                        data-aos-duration="600">
                                        <div
                                            className="d-flex flex-column justify-content-end position-relative overflow-hidden rounded-4 shadow-lg"
                                            style={{ height: "100%", minHeight: "450px", width: "100%" }} // set consistent height
                                        >
                                            <img
                                                src={IMAGE_URL + profile.image}
                                                alt={profile.name}
                                                className="img-fluid rounded-4 w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                                            />

                                            {/* Overlay */}
                                            <div
                                                className="position-absolute bottom-0 start-50 translate-middle-x text-white text-center bg-darkk bg-opacity-75 p-3 w-90 rounded-3"
                                                style={{
                                                    marginTop: "auto",
                                                    zIndex: 1,
                                                    lineHeight: "28px",
                                                    marginBottom: "20px",
                                                    // backdropFilter: "blur(5px)",
                                                }}

                                                data-aos="zoom-in"
                                                data-aos-delay={`${index * 200}`}
                                                data-aos-duration="600"
                                            >
                                                <h5 className="fw-bold mb-1">{translateSync(profile.name)}</h5>
                                                <p className="mb-1">{translateSync(profile.designation)}</p>
                                                <a
                                                    style={{ cursor: "pointer" }}
                                                    className="text-white fw-bold"
                                                    onClick={() => readMore(profile)}
                                                >
                                                    {translateSync('Read More')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            else if (index === 3) {
                                return (
                                    <>
                                        <div className="col-md-4 d-flex justify-content-center mb-4"></div>
                                        <div className="col-md-4 d-flex justify-content-center mb-4" key={index}>

                                            <div
                                                className="d-flex flex-column justify-content-end position-relative overflow-hidden rounded-4 shadow-lg"
                                                style={{ height: "100%", minHeight: "450px", width: "100%" }} // set consistent height
                                            >
                                                <img
                                                    src={IMAGE_URL + profile.image}
                                                    alt={profile.name}
                                                    className="img-fluid rounded-4 w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                                                />

                                                {/* Overlay */}
                                                <div
                                                    className="position-absolute bottom-0 start-50 translate-middle-x text-white text-center bg-darkk bg-opacity-75 p-3 w-90 rounded-3"
                                                    style={{
                                                        marginTop: "auto",
                                                        zIndex: 1,
                                                        lineHeight: "28px",
                                                        marginBottom: "20px",
                                                        // backdropFilter: "blur(5px)",
                                                    }}
                                                >
                                                    <h5 className="fw-bold mb-1">{translateSync(profile.name)}</h5>
                                                    <p className="mb-1">{translateSync(profile.designation)}</p>
                                                    <a
                                                        style={{ cursor: "pointer" }}
                                                        className="text-white fw-bold"
                                                        onClick={() => readMore(profile)}
                                                    >
                                                        {translateSync('Read More')}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 d-flex justify-content-center mb-3 emptydivsec"> </div>
                                    </>
                                )

                            }
                        })}
                    </div>
                </div>

            </div>

        </>
    );
};




export default ProfileGrid;
