import React, { useEffect, useState } from "react";
// import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
// import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import apiProvider from '../../apiProvider/categoryApi';
import { IMAGE_URL } from "../../network/apiClient";
import { handleForm } from "../../redux/trainingForm";
import { useTranslation } from "../../context/TranslationContext";

import { Helmet } from 'react-helmet-async';

const programs = [
  "Customer Service",
  "Leadership and Management",
  "Personal and Development Skill",
  "Sales and Marketing",
  "Administration and Secretarial",
  "Strategy and Strategic Planning",
];
const durations = ["0 - 2 hours", "0 - 3 hours", "0 - 4 hours", "0 - 5 hours", "0 - 6 hours"];
const courses = Array(2).fill({
  title: "Multilingual Customer Service Training",
  date: "27 Apr - 07 Dec, 2025",
  price: "USD 1,500",
  location: "UAE",
  description:
    "Personal time management skills are essential for professional & personal success in any area of life. Able to successfully implement time management strategies.",
  img: "/img/trin-one.png", // Replace with actual image URL
});

const TrainingPage = () => {
  const { id } = useParams();
  const disPatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 Search state
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();


  const trainingFormData = useSelector((state) => state.training);
  const [categoryDetails, setCategoryDetails] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [categoryHeadername, setCategoryHeadername] = useState("")




  // useEffect(() => {
  //  // Get the ID from the URL
  //   console.log("Route ID:", id);
  //     if (trainingFormData && trainingFormData.isGetList){
  //       getCategoryDetails(trainingFormData.id);
  //       getCategoryList(id);
  //     }
  //   },[trainingFormData]);

  useEffect(() => {
    // console.log(id, "idd enter");
    window.scrollTo(0, 0);


    if (id) {
      getCategoryDetails(id);
      getCategoryList(id);
    }
  }, [id])

  const getCategoryDetails = async (id) => {
    const result = await apiProvider.getCategoryDet(id);
    console.log(result, "result---");

    // console.log({ result })
    if (result && result.status && result.response) {
      setCategoryDetails(result.response.data)
    }
  };

  const getCategoryList = async (id) => {
    const result = await apiProvider.getCourseCategoryList(id);
    console.log(result, "resultresultfffffffff");


    if (result && result.status) {
      setCategoryList(result.response.data)
    }
  };
  const viewForm = async (id) => {
    disPatch(handleForm({ isGetList: true, id: id }));
    // console.log(id, "id-ttttttt");
    navigate(`/training-detail/${id}`);
  }

  const navigateToList = async (val) => {
    disPatch(handleForm({ isGetList: true, id: id }));
    // console.log(val, "id-ttttttt");
    getCategoryList(val.id);
    getCategoryDetails(val.id);
    setCategoryHeadername(val.categoryName)

  }
  // console.log(categoryList, "categoryList-render");
  const filteredCourses = categoryDetails.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // function formatDate(dateStr) {
  //   if (!dateStr) return "";

  //   const [day, month, year] = dateStr.split("-");
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //   const formattedDate = `${day} ${monthNames[parseInt(month) - 1]}, ${year}`;
  //   return formattedDate;
  // }
  function formatCourseDates(courseDates) {
    if (!Array.isArray(courseDates) || courseDates.length === 0) return "";

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to compare only date part

    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      // Format: "dd-mm-yyyy"
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`);
      }

      // Format: "dd Mon yyyy" or "dd Mon, yyyy"
      const cleaned = dateStr.replace(",", "");
      return new Date(cleaned);
    };

    const formatDate = (dateStr) => {
      if (/[0-9]{1,2} [A-Za-z]{3},? [0-9]{4}/.test(dateStr)) {
        return dateStr.replace(",", "");
      }

      const [day, month, year] = dateStr.split("-");
      const monthName = monthNames[parseInt(month, 10) - 1];
      return `${day} ${monthName} ${year}`;
    };

    // Find the first future date
    for (const item of courseDates) {
      const parsedDate = parseDate(item.date);
      if (parsedDate && parsedDate >= today) {
        return formatDate(item.date); // Return the first future date found
      }
    }

    return "----TBA"; // Return empty string if no future dates found
  }

  // Add this helper function outside your component
  const calculateDiscountPercentage = (originalPrice, offerPrice) => {
    const discount = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(discount);
  };


  return (
    <>

      <Helmet>
        <title>Leadership and management courses | iLap Training</title>
        <meta
          name="keywords"
          content="leadership training and consulting, advanced facilities, train the trainer course, business development courses, executive training, leadership training dubai, lead environment management services"
        />

      </Helmet>

      <div>


        <section className="Home-banner-3  text-white py-5 position-relative">
          <div className="container d-flex flex-column flex-md-row align-items-center">
            <div className="col-md-12 text-center  home-header" >
              <div className="innerbanner-txt " data-aos="zoom-in" data-aos-delay="200">
                <h1 className="fw-bold text-center display-5  font-51">{categoryList && categoryList.length > 0 && categoryList[0].categoryType == 1 ? translateSync("Online") : translateSync("Classroom")}</h1>
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="" title="" itemprop="url">{translateSync('Program')}</a></li>
                  <li class="breadcrumb-item active">{categoryHeadername && categoryHeadername ? translateSync(categoryHeadername) : categoryDetails && categoryDetails.length && categoryDetails[0].categoryName ? translateSync(categoryDetails[0].categoryName) : categoryList && categoryList.length > 0 && translateSync(categoryList[0].categoryName)}</li>
                </ol>
              </div>

            </div>

          </div>
        </section>
        <section className="py-5 px-3 px-md-5 trainingpage-sideandmain-area">
          <div className="container-fluid">
            <div className="row">
              {/* Sidebar - Hidden on mobile */}
              <div className="col-md-3 d-md-block">
                <div className="sidebar">
                  <div className="widget widget-categories mb-5" data-aos="fade-up" data-aos-delay="200">
                    <h5 className="widget-title">{translateSync('Programs')}</h5>
                    <ul>
                      {categoryList.map((program, index) => (
                        <li key={index}>
                          <a href="#" className="text-black text-decoration-none fw-400" onClick={() => navigateToList(program)}>
                            {translateSync(program.categoryName)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-12 col-md-9">
                {/* Search Bar - Full width on mobile, aligned right on larger screens */}
                <div className="row mb-4">
                  <div className="col-12 col-md-8 col-lg-8 mb-3 mb-md-0"></div>
                  <div className="col-12 col-md-4 col-lg-4">
                    <input
                      type="text"
                      className="form-control p-2 border-1 rounded"
                      placeholder={translateSync("Search by course name")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Course Cards Grid */}
                <div className="row">
                  {filteredCourses && filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                      <div className={`col-md-6 col-lg-6 mb-4 d-flex position-relative ${formatCourseDates(course.courseDate) === "----TBA" ? "course-inactive" : ""}`} key={index} >
                        {/* Enhanced Offer Badge with Gradient + Animation */}
                        {formatCourseDates(course.courseDate) === "----TBA" && (
                          <div className="tba-badge">
                           {translateSync(' Coming Soon')}
                          </div>
                        )}
                        {
                          course.offerPrice && (
                            <div
                              className="offer-badge-premium"
                              style={{
                                position: 'absolute',
                                left: index % 2 === 0 ? '-17px' : '-17px', // Left for even index (left cards)
                                right: index % 2 === 1 ? '-17px' : 'auto', // Right for odd index (right cards)
                                color: 'white',
                                padding: '3px 10px',
                                fontSize: '11px',
                                fontWeight: '800',
                                zIndex: 2,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                textAlign: 'center',
                                lineHeight: '1.3',
                                transform: index % 2 === 0 ? 'rotate(5deg)' : 'rotate(5deg)', // Rotate differently for left/right
                                width: "120px",
                              }}
                            >
                              <img src="/img/Offer-batch.png" />
                              <div style={{
                                position: "relative",
                                bottom: index % 2 === 0 ? "65px" : "65px",
                                fontSize: '12px',
                                // transform: index % 2 === 1 ? 'scaleX(-1)' : 'none' // Flip text for right side if needed
                              }}>
                                {calculateDiscountPercentage(course.price, course.offerPrice)}% OFF
                              </div>                          </div>
                          )
                        }

                        < div className="card shadow-sm border rounded trainingpage-gridareaa w-100" >
                          {/* ... rest of your card content ... */}
                          < div className="flex-shrink-0" style={{ width: "200px" }}>
                            <img
                              src={IMAGE_URL + course.categoryImage}
                              className="img-fluid rounded-start h-100"
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                              alt="Course"
                            />
                          </div>

                          {/* Card Body (Flexible Content) */}
                          <div className="card-body trainpartt text-start d-flex flex-column flex-grow-1">
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                {/* Updated Course Name with text wrapping */}
                                <h5 className="fw-bold mb-2" style={{
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                  overflow: "visible",
                                  textOverflow: "unset"
                                }}>
                                  {translateSync(course.courseName)}
                                </h5>
                                {course.locationName && (
                                  <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: "10px" }}>
                                    <img src="/img/mapp.png" alt="Location" style={{ width: "16px", height: "16px" }} />
                                    {translateSync(course.locationName)}
                                  </span>
                                )}
                              </div>
                              {/* Rest of your card content remains the same */}
                              <div className="d-flex justify-content-between align-items-center text-muted my-2" style={{ fontSize: "13px" }}>
                                {course && course.courseDate && formatCourseDates(course.courseDate) &&
                                  <span className="d-flex align-items-center gap-2">
                                    <img src="/img/calenderr.png" alt="Calendar" style={{ width: "16px", height: "16px" }} />
                                    {formatCourseDates(course.courseDate)}
                                  </span>
                                }
                                <div>
                                  {course.offerPrice ? (
                                    <>
                                      <h6 className="pricee fw-bold m-0">$ <span style={{ color: "#582d86", textDecoration: "line-through" }}>
                                        {Number(course.price)} </span></h6>
                                      <h6 className="pricee fw-bold m-0" >$ <span style={{ color: "#582d86" }}>
                                        {Number(course.offerPrice)}</span></h6>
                                    </>
                                  ) : (
                                    <>
                                      <h6 className="pricee fw-bold m-0" style={{ color: "#582d86" }}>${course.price}</h6>
                                    </>
                                  )}
                                </div>
                              </div>

                              <p className="card-text text-muted mb-2" style={{ fontSize: "14px" }}>
                                {translateSync(course.shortDescription)}
                              </p>
                            </div>

                            <div className="mt-auto">


                              <button class="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3" style={{ fontSize: "13px", color: "#fff", padding: "5px 8px 5px 8px", height: "35px", lineHeight: "23px", border: "2px solid #582d86" }}
                                onClick={() => viewForm(course.id)}><span data-text={translateSync("Know more")}>{translateSync('Know more')}</span></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <h4>{translateSync('No courses found')}</h4>
                    </div>
                  )}
                </div>
              </div>
            </div >
          </div >
        </section >

      </div >

    </>
  );
};

export default TrainingPage;
