import React, { useState, useEffect } from "react";
import apiProvider from "../../apiProvider/api";
import { IMAGE_URL } from "../../network/apiClient";
import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from '../../context/TranslationContext';

import { Helmet } from 'react-helmet-async';


const FacilitatorsPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [facilitatorsData, setFacilitatorsData] = useState([]);
  const navigate = useNavigate();
  const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();



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
      const result = await apiProvider.getFacilitors();
      console.log(result, "result-fac");
      if (result) {
        setFacilitatorsData(result.response.data.data);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const readMore = (data) => {
    console.log(data.slug, "dataaaaaaaa.slug");
    navigate(`/facilitator-detail/${data.slug}`)

  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>


      <Helmet>
        <title>Logistics courses in dubai | iLap Training</title>
        <meta
          name="keywords"
          content="logistics courses, training in dubai, personal development courses in dubai, financial planning and analysis course, train the trainer certification, training companies in dubai, event management courses in dubai"
        />

      </Helmet>

      {/* Header Section */}

      <div>

        <section className="Home-banner-3  text-white py-5 position-relative">
          <div className="container d-flex flex-column flex-md-row align-items-center">
            <div className="col-md-12 text-center  home-header" >
              <div className="innerbanner-txt " data-aos="zoom-in" data-aos-delay="200">
                <h1 className="fw-bold text-center display-5  font-51">{translateSync('Our Facilitators')}</h1>
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a>{translateSync('About')}</a></li>
                  <li class="breadcrumb-item active">{translateSync('Our Facilitators')}</li>
                </ol>
              </div>

            </div>

          </div>
        </section>


        {/* Facilitators Section */}
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              {facilitatorsData.map((facilitator, index) => (
                <div key={index} className="col-md-3" data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                  data-aos-duration="600">
                  <div
                    className="position-relative overflow-hidden"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Facilitator Image */}
                    <img
                      src={IMAGE_URL + facilitator.image}
                      alt={facilitator.name}
                      className="img-fluid w-100 facilitator-fullpage-size"
                      style={{ height: "300px", objectFit: "cover" }}
                    />

                    {/* Hover Overlay (Name, Title & Read More) */}
                    <div
                      className={`position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center bg-primary facihover bg-opacity-75 transition ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                      style={{
                        transition: "opacity 0.4s ease-in-out",
                      }}
                    >
                      <h5 className="fw-bold">{translateSync(facilitator.name)}</h5>
                      <p className="mb-2">{translateSync(facilitator.designation)}</p>
                      <a style={{ cursor: "pointer" }} onClick={() => readMore(facilitator)} className="text-white text-decoration-underline fw-400 ">
                        {translateSync('Read More')}
                      </a>
                    </div>

                    {/* Name & Title Below Image (Hidden on Hover) */}
                    <div
                      className={`text-center mt-2 `}
                      style={{
                        visibility: hoveredIndex === index ? "hidden" : "visible"
                      }} data-aos="zoom-in"
                      data-aos-delay={`${index * 200}`}
                      data-aos-duration="600"
                    >
                      <h5 className="fw-bold">{translateSync(facilitator.name)}</h5>
                      <p className="text-muted">{translateSync(facilitator.designation)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

    </>



  );
};

export default FacilitatorsPage;
