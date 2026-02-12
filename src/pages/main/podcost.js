import React from "react";

import { Helmet } from 'react-helmet-async';
import { useTranslation } from "../../context/TranslationContext";

const ComingSoon = () => {
  const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();


  return (
    <>

      <Helmet>
        <title>Executive coaching Saudi Arabia | iLap Training</title>
        <meta
          name="keywords"
          content="دورات تدريبية في السعودية, شركة تدريب بالرياض, تدريب الموظفين في السعودية, دورات تنمية المهارات في الرياض, تدريب الموارد البشرية, team building activities Riyadh, coaching services in KSA"
        />

      </Helmet>



      <div >
        <section className="Home-banner-4 text-white position-relative py-4 py-md-5" >
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 text-center text-md-start home-header" style={{ marginTop: "100px" }}>
                {/* Static Title */}
                {/* <h1 className="fw-bold display-5 font-51 mb-3 mb-md-4" style={{ fontSize: "2rem" }}>
                  Discover Podcast Bliss Today
                </h1> */}
                <div className="overlays bannercontentareaa" style={{ top: "55%" }}>
                  <h1 className="fw-bold display-5 text-white">
                    {translateSync('Voices That Shape Professional Growth')}
                  </h1>
                  <p className="font-25 text-white">

                    {translateSync('Sit back, relax, and tune in to inspiring podcast episodes featuring business leaders, field influencers, and learning experts sharing real stories and insights that elevate your career and workforce development.')}
                  </p>
                  {/* <button className="rbt-btn btn-gradient banner-btn rbt-switch-btn  "><a href="/contact" >
                    <span data-text="Ping Us">Ping Us</span>
                  </a>
                  </button> */}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* <section className="podcost-transforms-section py-5 ">

          <div class="wrapperpodcost">
            <h1 class="gradient-text">Coming soon<span class="dot">.</span></h1>

            <p>iLap podcast will be rolling out shortly.</p>

            <div class="icons">
              <a href=""><i class="fa fa-twitter"></i></a>
              <a href=""><i class="fa fa-youtube-play"></i></a>
              <a href=""><i class="fa fa-paper-plane"></i></a>
            </div>
          </div>

        </section> */}
        <section className="py-5 px-3 px-md-5 trainingpage-sideandmain-area">
          <div className="container-fluid">
            <div className="mb-4">
              <h2 className="fw-bold text-center text-bg-light-color" data-aos="fade-up" data-aos-delay="300">{translateSync('Most Popular episodes for this week')}</h2>
            </div>
            <br></br>
            <div className="row">
              {/* Active Video Card */}
              <div className="col-md-6 col-lg-6 mb-4 d-flex position-relative">
                <div className="offer-badge-premium" style={{
                  position: 'absolute',
                  left: '-17px',
                  color: 'white',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: '800',
                  zIndex: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign: 'center',
                  lineHeight: '1.3',
                  transform: 'rotate(5deg)',
                  width: "120px",
                }}></div>

                <div className="card shadow-sm border rounded trainingpage-gridareaa w-100">
                  <div className="flex-shrink-0" style={{ width: "325px", position: "relative" }}>
                    <video
                      className="img-fluid rounded-start h-100"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000"
                      }}
                      controls
                      poster="/video/podcast_1.mp4"
                    >
                      <source src="/video/podcast_1.mp4" type="video/mp4" />
                      {translateSync('Your browser does not support the video tag.')}
                    </video>
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1,
                      pointerEvents: "none"
                    }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#582d86" fillOpacity="0.8" />
                        <path d="M10 8L16 12L10 16V8Z" fill="white" />
                      </svg>
                    </div>
                  </div>

                  <div className="card-body trainpartt text-start d-flex flex-column flex-grow-1">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="fw-bold mb-2" style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflow: "visible",
                          textOverflow: "unset"
                        }}>
                          {translateSync('A Gathering with a Backstory')}
                        </h5>
                      </div>

                      <p className="card-text text-muted mb-2" style={{ fontSize: "14px" }}>
                        {translateSync('A story told by our special guest Fatima Alloghani, Founder and CEO of Born2Localize, uncovering valuable insights and tips for both this and the next generation.')}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <button className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3" style={{ fontSize: "13px", color: "#fff", padding: "5px 8px 5px 8px", height: "35px", lineHeight: "23px", border: "2px solid #582d86" }} onClick={() => window.open("https://youtu.be/xRinuGEVXus?si=d22c12YUVn48YEti", "_blank")}>
                        <span data-text={translateSync("Open Youtube")}>{translateSync('Play Episode')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon Skeleton Card */}
              <div className="col-md-6 col-lg-6 mb-4 d-flex position-relative">
                <div className="card shadow-sm border rounded trainingpage-gridareaa w-100" style={{ opacity: 0.7 }}>
                  <div className="flex-shrink-0" style={{ width: "325px", position: "relative", backgroundColor: "#f5f5f5" }}>
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: "18px",
                      fontWeight: "bold"
                    }}>
                      {translateSync('COMING SOON')}
                    </div>
                  </div>

                  <div className="card-body trainpartt text-start d-flex flex-column flex-grow-1">
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="fw-bold mb-2" style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflow: "visible",
                          textOverflow: "unset",
                          color: "#ccc"
                        }}>
                          {translateSync('New Episode Coming Soon')}
                        </h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center text-muted my-2" style={{ fontSize: "13px" }}>
                      </div>

                      <p className="card-text text-muted mb-2" style={{ fontSize: "14px", color: "#ddd" }}>
                        {translateSync("We're preparing something special for you. Stay tuned for our next episode!")}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <button className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3" style={{
                        fontSize: "13px",
                        color: "#fff",
                        padding: "5px 8px 5px 8px",
                        height: "35px",
                        lineHeight: "23px",
                        border: "2px solid #ddd",
                        backgroundColor: "#ddd",
                        cursor: "not-allowed"
                      }} disabled>
                        <span data-text={translateSync("Coming Soon")}>{translateSync('Coming Soon')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>


    </>
  );
};

export default ComingSoon;
