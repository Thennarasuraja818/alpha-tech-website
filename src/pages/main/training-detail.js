
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';

import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'
import apiProvider from "../../apiProvider/categoryApi";
import addToCartApi from "../../apiProvider/addToCartApi";
import loginApi from "../../apiProvider/api";
import { login } from '../../redux/authSlice'
import { format, addDays, parse } from 'date-fns';
// import { format, addDays, parse } from 'date-fns';
import { useTranslation } from "../../context/TranslationContext";

import { Helmet } from 'react-helmet-async';


const SigninSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  feedback: Yup.string().required("Feedback is required"),
  rating: Yup.number().required("Ratings is required"), // Change type to number
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});




// Signup Validation Schema
const SignupSchema = Yup.object().shape({
  userName: Yup.string().required("User name is required"),
  regEmail: Yup.string().email("Invalid email").required("Email is required"),
  regPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("regPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});



const TrainingDetailPage = () => {
  const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

  const navigate = useNavigate();
  const disPatch = useDispatch()
  const [isLogin, setIsLogin] = useState(localStorage.getItem("userToken"))

  const { courseId } = useParams();
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [overallRating, setOverallRating] = useState({
    ratingScore: "",
    reviewCount: ""
  });

  const courseDatas = useSelector((state) => state.training);
  const isAuthenticated = useSelector((state) => state.auth.token);
  const [courseDetails, setCourseDetails] = useState([])
  const [reviews, setReviews] = useState([]);
  const [isAddToCart, setIsAddToCart] = useState(false)
  const [isPurchaseCart, setIsPurchaseCart] = useState(false)
  const [userDetails, setUserDetails] = useState([])
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log(isLogin, "isLogin");


  useEffect(() => {
    if (courseDatas && courseDatas.isGetList) {
      getCategoryDetails(courseDatas.id);
      getReviewDetails(courseDatas.id);
    }
  }, [])

  useEffect(() => {

  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
    // console.log(courseId, "routerCourseId");

    if (courseId) {
      getCategoryDetails(courseId);
    }
  }, [courseId]);

  const getCategoryDetails = async (id) => {
    const result = await apiProvider.getCourseDet(id);
    console.log(result, "rrrrrrr")
    if (result && result.status && result.response) {
      setCourseDetails(result.response.data)
    }
  };

  const loginSubmit = async (data) => {
    try {
      const input = { email: data.email, password: data.password };
      const result = await loginApi.login(input);
      console.log(result, "resss");

      if (result && result.status === 200 && result.response) {
        localStorage.setItem('userToken', result.response.token);
        disPatch(login({ token: result.response.data.token }));
        // / Close the Bootstrap modal
        const modalElement = document.getElementById("loginModal");
        if (modalElement) {
          const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
          modal.hide();
          window.location.reload();
          // getCartDetails();
        }
      }
      // Check for error message and show toast
      if (result?.response?.response?.data?.message) {
        toast.error(result?.response?.response?.data?.message, {
          autoClose: 2000,
        });
      } else {
        // toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    }
  };






  const registerSubmit = async (value) => {
    console.log(value, "value");

    try {
      const input = {
        userName: value.userName,
        email: value.regEmail,
        password: value.regPassword,
        confirmPassword: value.confirmPassword
      }
      console.log(input, "input");
      const result = await loginApi.register(input)
      console.log(result, "result");
      if (result && result.response && result.status == 200) {
        // navigate("/login")
        setIsRegistering(false)
      }
      if (result.response.response.data.message) {
        let toastMsg = result.response.response.data.message
        console.log(toastMsg, "toastMsg");
        toast.error(toastMsg)
      }

      // setIsRegistering(false);

    } catch (error) { }
  }


  const formSubmit = async (data) => {

    // console.log(data, "dddd");
    try {
      const input = {
        courseId: courseDatas.id,
        name: userDetails.name || data.name,
        email: userDetails.email || data.email,
        feedback: data.feedback,
        rating: data.rating
      }
      // console.log(input, "input");

      const result = await apiProvider.addReview(input);
      // console.log("result:", result)
      // / Close the Bootstrap modal
      const modalElement = document.getElementById("exampleModal");
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modal.hide();
      }

    } catch (err) {

    }
  }

  const getReviewDetails = async (id) => {
    const result = await apiProvider.getReviewDet(id);
    // console.log(result, "result--review");

    if (result && result.status && result.response) {
      setReviews(result.response.data)
      // Calculate total number of reviews (users who gave a rating)
      const totalReviews = result.response.data.length;
      // Calculate overall rating
      const totalRating = result.response.data.reduce((sum, review) => sum + parseFloat(review.rating), 0);
      const overallRating = (totalRating / totalReviews).toFixed(1);
      let overAllRating = `${overallRating} (${totalReviews.toLocaleString()} reviews)`
      // console.log(overAllRating, "overAllRating");

      setOverallRating({
        ratingScore: overallRating,
        reviewCount: (totalReviews.toLocaleString() + "  " + "reviews")
      })
      // console.log();
    }
  };

  const CurriculumList = ({ curriculum }) => {
    const [activeIndex, setActiveIndex] = useState(0); // First accordion open by default

    const toggleAccordion = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };


    return (
      <div className="accordion" id="curriculumAccordion">
        {curriculum.length > 0 &&
          curriculum.map((unit, index) => (
            <div
              className="card curriculamlisthead mb-4 shadow-sm"
              key={unit.serial}
              onClick={() => toggleAccordion(index)}
              style={{ cursor: "pointer" }}
            >
              <div className="curriculamlistheadd text-black d-flex justify-content-between" id={`heading${index}`}>
                <div className="col-8">
                  <h6 className="mb-0">
                    Unit {unit.serial} :  {translateSync(unit.title)}
                  </h6>
                </div>
                <div className="col-3">
                </div>
                <div className="col-1">
                  <span>
                    <i className={`bi ${activeIndex === index ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                  </span>
                </div>


              </div>
              <div
                id={`collapse${index}`}
                className={`collapse ${activeIndex === index ? "show" : ""}`}
                aria-labelledby={`heading${index}`}
                data-parent="#curriculumAccordion"
              >
                <div className="card-body">
                  <ul className="list-unstyled">
                    {unit.subTitle &&
                      unit.subTitle.map(
                        (topic, idx) =>
                          topic !== "undefined" && (
                            <li key={idx} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                              <a href="instructors.html" className="d-flex align-items-center  text-decoration-none">
                                <img
                                  src="/img/document.png"
                                  alt="Document"
                                  className="img-fluid rounded me-2"
                                  style={{ width: "20px", height: "20px" }}
                                />
                                {translateSync(topic)}
                              </a>
                              <a href="single-course.html">
                                <img
                                  src="/img/lock.png"
                                  alt="Locked"
                                  className="img-fluid rounded"
                                  style={{ width: "20px", height: "20px" }}
                                />
                              </a>
                            </li>
                          )
                      )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const ReviewList = ({ reviews }) => (
    <div>
      {reviews.map((review, index) => (
        <div key={index} className="mb-3 p-3 border-0 shadow-sm">

          <div className="d-flex">
            <img
              style={{ width: "60px", height: "60px" }}
              src="/img/Profile_img.jpg"
              alt={review.name}
              className="rounded-circle me-3"
              width="130"
              height="130"
            />
            <div>
              <h6 className="fw-bold mb-1">{review.name.toUpperCase()}</h6>
              <div className="text-warning mb-2">
                {"⭐".repeat(review.rating)}
              </div>
              <p className="text-muted">{review.feedback}</p>
              {/* <div className="d-flex gap-2">
                <button className="btn btn-light border rounded-circle p-2">👍</button>
                <button className="btn btn-light border rounded-circle p-2">👎</button>
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const buyNow = async (id) => {
    if (isAuthenticated && id) {
      navigate("/checkout?type=buynow");
    }
    else {
      navigate("/login");
    }
  }

  const addToCart = async (id) => {
    let reqData = { courseId: id }
    // console.log(reqData, "reqData");
    if (isAddToCart) {
      // toast("Already added to cart")
      navigate("/cart");
    } else {
      const result = await addToCartApi.addToCart(reqData);
      // console.log(result, "rrrrrr");

      if (result && result.status && result.response) {
        navigate("/cart");
        setCourseDetails(result.response.data)
      }
      if (result && result.status == false) {
        // console.log("enter false");
        toast.error("You need to log in to add items to your cart.")

      }
    }
  }
  // console.log(overallRating, "overallRating");

  const getCartDetails = async (id) => {
    const result = await addToCartApi.getUserDetails();
    // console.log(result.response.data.userPurchaseDetails, "@@@@@@@@@");

    if (result && result.response && result.response.data && result.response.data.userPurchaseDetails.length > 0) {
      let purchardCart = result.response.data.userPurchaseDetails.find(ival => ival.id === courseDatas.id && ival.paymentStatus == "Success")
      // console.log(addtocart, "addtocart");

      if (purchardCart) {
        setIsPurchaseCart(true)
      }

    } else if (result && result.response && result.response.data && result.response.data.cartDetails.length > 0) {
      let addtocart = result.response.data.cartDetails.find(ival => ival.id === courseDatas.id)
      // console.log(addtocart, "addtocart");

      if (addtocart) {
        setIsAddToCart(true)
      }

    }
    if (result && result.response && result.response.data && result.response.data.userDetail) {
      // Assuming the API returns cart items in response.data.cartDetails
      setUserDetails(result.response.data.userDetail);
    }
  };


  useEffect(() => {
    getCartDetails()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const formatDateC = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthShort = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${monthShort}, ${year}`;
  }

  // function formatDate(dateStr) {
  //   if (!dateStr) return "";

  //   const [day, month, year] = dateStr.split("-");
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //   const formattedDate = `${day} ${monthNames[parseInt(month) - 1]}, ${year}`;
  //   return formattedDate;
  // }

  // function formatCourseDates(courseDates) {
  //   if (!Array.isArray(courseDates) || courseDates.length === 0) return "";

  //   return courseDates
  //     .map(item => {
  //       const dateStr = item.date;
  //       const parts = dateStr.match(/\d{1,2}/g); // extract day
  //       const month = dateStr.match(/[A-Za-z]+/g)?.[0]; // extract month
  //       const year = dateStr.match(/\d{4}/g)?.[0]; // extract year

  //       return `${parts?.[0]} ${month}, ${year}`;
  //     })
  //     .join(" & ");
  // }
  function formatCourseDates(courseDates) {
    if (!Array.isArray(courseDates) || courseDates.length === 0) return "";

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to compare only date part

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

    const format = (dateStr) => {
      if (/[0-9]{1,2} [A-Za-z]{3},? [0-9]{4}/.test(dateStr)) {
        return dateStr.replace(",", "");
      }

      const [day, month, year] = dateStr.split("-");
      const monthName = monthNames[parseInt(month, 10) - 1];
      return `${day} ${monthName} ${year}`;
    };

    const formattedDates = courseDates
      .filter(item => {
        const parsed = parseDate(item.date);
        return parsed && parsed >= today;
      })
      .map(item => format(item.date));

    return formattedDates.join(" , ");
  }

  const getParsedCourseDates = (course) => {
    const courseDateObj = course.courseDate?.[0];
    const startDate = parse(courseDateObj.date, 'dd-MM-yyyy', new Date());
    const endDate = addDays(startDate, courseDateObj.duration);

    return { startDate, endDate };
  };



  // console.log(formatCourseDates(courseDetails.courseDate), "courseDetails render fun");
  // For iCalendar (.ics file download)

  const addToGoogleCalendar = (course) => {

    try {
      if (!course?.courseDate?.length) {
        console.error("Missing course date");
        return;
      }

      const courseDateObj = course.courseDate[0];
      // console.log(courseDateObj, "courseDateObj");
      // Parse the start date
      const startDate = parse(courseDateObj.date, 'dd-MM-yyyy', new Date());
      if (isNaN(startDate)) {
        console.error("Parsed date is invalid");
        return;
      }
      // Calculate end date based on duration
      const endDate = addDays(startDate, courseDateObj.duration);
      // Format to Google Calendar date format (all-day format)
      const formattedStart = format(startDate, "yyyyMMdd");
      const formattedEnd = format(endDate, "yyyyMMdd");

      // Construct Google Calendar URL
      const url = new URL('https://www.google.com/calendar/render');
      url.searchParams.append('action', 'TEMPLATE');
      url.searchParams.append('text', course.courseName || 'Course Event');
      url.searchParams.append('dates', `${formattedStart}/${formattedEnd}`);
      url.searchParams.append('details', course.description || '');
      url.searchParams.append('location', course.locationName || 'Online');
      url.searchParams.append('sf', 'true');
      url.searchParams.append('output', 'xml');
      window.open(url.toString(), '_blank');
    } catch (error) {
      console.error("Error adding to Google Calendar:", error);
    }
  };

  const addToICalendar = (course) => {
    const { startDate, endDate } = getParsedCourseDates(course);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${format(startDate, 'yyyyMMdd')}`,
      `DTEND;VALUE=DATE:${format(endDate, 'yyyyMMdd')}`,
      `SUMMARY:${course.courseName}`,
      `DESCRIPTION:Course: ${course.courseName}\\nDuration: ${course.courseDate[0].duration} days`,
      `LOCATION:${course.location || 'Online'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${course.courseName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // For Outlook 365
  const addToOutlook365 = (course) => {
    const { startDate, endDate } = getParsedCourseDates(course);

    const startStr = format(startDate, "yyyy-MM-dd'T'00:00:00");
    const endStr = format(endDate, "yyyy-MM-dd'T'00:00:00");

    const url = new URL('https://outlook.office.com/calendar/0/deeplink/compose');
    url.searchParams.append('path', '/calendar/action/compose');
    url.searchParams.append('rru', 'addevent');
    url.searchParams.append('subject', course.courseName);
    url.searchParams.append('startdt', startStr);
    url.searchParams.append('enddt', endStr);
    url.searchParams.append('body', `Course: ${course.courseName}\nDuration: ${course.courseDate[0].duration} days`);
    url.searchParams.append('location', course.location || 'Online');

    window.open(url.toString(), '_blank');
  };


  // For Outlook Live
  const addToOutlookLive = (course) => {
    const { startDate, endDate } = getParsedCourseDates(course);

    const startStr = format(startDate, "yyyy-MM-dd'T'00:00:00");
    const endStr = format(endDate, "yyyy-MM-dd'T'00:00:00");

    const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    url.searchParams.append('subject', course.courseName);
    url.searchParams.append('startdt', startStr);
    url.searchParams.append('enddt', endStr);
    url.searchParams.append('body', `Course: ${course.courseName}\nDuration: ${course.courseDate[0].duration} days`);
    url.searchParams.append('location', course.location || 'Online');

    window.open(url.toString(), '_blank');
  };


  return (
    <>

      <Helmet>
        <title>Training institutes in abu dhabi | iLap Training</title>
        <meta
          name="keywords"
          content="list of training centers in abu dhabi, public speaking courses dubai, certified associate in project management, social media marketing courses, safety training management, frm course, orient management consulting & training"
        />

      </Helmet>

      <div>
        {/* Hero Section */}
        <section className="Home-banner-2 text-white position-relative py-4 py-md-5">
          <div className="container">
            <div className="row">
              {/* Main Content - Full width on mobile, half on desktop */}
              <div className="col-12 col-md-6 text-center text-md-start home-header">
                {/* Course Title */}
                <h1 className="fw-bold display-5 font-51 mb-3 mb-md-4" data-aos="zoom-in" data-aos-delay="200" style={{ fontSize: "2rem" }}>
                  {translateSync(courseDetails?.courseName)}
                </h1>

                {/* Course Details */}
                <div className="learning-detail-partt mt-3 mt-md-5">
                  {/* Course Type */}
                  <div className="d-flex">
                    <p className="font-16 mb-3 mb-md-0" data-aos="zoom-in" data-aos-delay="200">
                      <img
                        src="/img/dot.png"
                        alt="Course Type"
                        className="img-fluid me-2"
                        style={{ width: "16px", height: "16px" }}
                      />
                      {translateSync(courseDetails.categoryType)}
                    </p>
                    {courseDetails.locationName && (
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: "16px", color: "white" }}>
                        <img src="/img/locationn.png" alt="Location" style={{ width: "20px", height: "20px", marginLeft: "25px" }} />
                        {translateSync(courseDetails?.locationName)}
                      </span>
                    )}

                  </div>

                  {/* Details Row - Stack on mobile, inline on desktop */}
                  <div className="course-sub-details d-flex flex-column  flex-lg-row align-items-start  text-white mt-3 gap-3 gap-md-3">
                    {/* Update Date */}
                    <div className="d-flex align-items-center me-md-4" data-aos="zoom-in" data-aos-delay="200">
                      {courseDetails && courseDetails.courseDate && formatCourseDates(courseDetails.courseDate) &&
                        <>

                          <img
                            src="/img/today.png"
                            alt="Calendar"
                            className="img-fluid me-2"
                            style={{ width: "16px", height: "16px" }}
                          />
                          {/* <span className="fs-6">
                        Date - {courseDetails && courseDetails.courseDate && courseDetails.courseDate[0].date ? formatDate(courseDetails.courseDate[0].date) : formatDateC(courseDetails.createdAt)}
                      </span> */}
                          <span className="fs-6">
                            {translateSync("Date")} - {formatCourseDates(courseDetails.courseDate)}
                          </span>
                        </>
                      }
                      {!formatCourseDates(courseDetails.courseDate) &&
                        <>

                          <img
                            src="/img/today.png"
                            alt="Calendar"
                            className="img-fluid me-2"
                            style={{ width: "16px", height: "16px" }}
                          />
                          {/* <span className="fs-6">
                        Date - {courseDetails && courseDetails.courseDate && courseDetails.courseDate[0].date ? formatDate(courseDetails.courseDate[0].date) : formatDateC(courseDetails.createdAt)}
                      </span> */}
                          <span className="fs-6" >
                           {translateSync("Date")} - <span style={{ color: "red" }}>TBA</span>
                          </span>
                        </>
                      }
                    </div>

                    {/* Language */}
                    <div className="d-flex languagetraining align-items-center me-md-4" data-aos="zoom-in" data-aos-delay="200">
                      <img
                        src="/img/world.png"
                        alt="Language"
                        className="img-fluid me-2"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span className="fs-6">
                        {translateSync(courseDetails.lang)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="d-flex pricetraining align-items-center" data-aos="zoom-in" data-aos-delay="200">
                      {/* <span className="fs-6 fw-bold">
                        ${courseDetails.price}
                      </span> */}
                      {courseDetails.offerPrice ? (
                        <>
                          {/* <h6 className="pricee fw-bold m-0">$ <span style={{ color: "#582d86", textDecoration: "line-through" }}>
                            {Number(courseDetails.price) + Number(courseDetails.offerPrice)} </span></h6>
                          <h6 className="pricee fw-bold m-0" >$ <span style={{ color: "#582d86" }}>
                            {courseDetails.price}</span></h6> */}
                          <span className="fs-6 fw-bold " style={{ textDecoration: "line-through", paddingRight: '10px' }}>
                            ${courseDetails.price}
                          </span>
                          <span className="fs-6 fw-bold">
                            ${Number(courseDetails.offerPrice)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="fs-6 fw-bold">
                            ${courseDetails.price}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="calender" style={{ paddingLeft: '20px' }}>
                      <div className="d-flex align-items-center" data-aos="zoom-in" data-aos-delay="200">
                        {/* <span className="fs-6 fw-bold me-2">Choose Option:</span> */}
                        <select className="form-select form-select-sm" style={{ width: '200px' }}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "google") {
                              addToGoogleCalendar(courseDetails)
                            } else if (value === "ical") {
                              addToICalendar(courseDetails)
                              // Handle iCalendar logic or download
                            } else if (value === "outlook365") {
                              addToOutlook365(courseDetails)

                              // Handle Outlook 365 logic
                            } else if (value === "outlooklive") {
                              addToOutlookLive(courseDetails)

                              // Handle Outlook Live logic
                            }
                          }}>
                          <option value="">{translateSync('Add to calendar')}</option>
                          <option value="google">{translateSync('Google Calendar')}</option>
                          <option value="ical">{translateSync('iCalendar')}</option>
                          <option value="outlook365">{translateSync('Outlook 365')}</option>
                          <option value="outlooklive">{translateSync('Outlook Live')}</option>
                        </select>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Image Column - Add if you have an image to show */}
              {/* <div className="col-md-6 d-none d-md-block">
        <img src={courseImage} alt={courseDetails.courseName} className="img-fluid" />
      </div> */}
            </div>
          </div>
        </section>

        <section className="py-1">
          <div className="container d-flex flex-column flex-md-row align-items-center">

            <div className="col-md-7 col-lg-6 mb-4" data-aos="fade-right" data-aos-delay="200">
              <div className="d-flex justify-content-between align-items-center mb-3 trainingimgg">
                <div className="card-body">
                  <div className="card moduleseccpagee p-3 shadow-sm rounded-4 d-flex flex-row justify-content-around align-items-center" >
                    <div className="text-center">
                      <h5 className="fw-bold text-bg-light-color mt-3 mb-3" >{translateSync('Modules')}</h5>
                      <p className="text-muted" title={courseDetails && courseDetails.shortDescription && courseDetails.shortDescription}>
                        {courseDetails && courseDetails.shortDescription && translateSync(courseDetails?.shortDescription)
                          .split(" ")
                          .slice(0, 3)
                          .join(" ")}{" "}
                        <br />
                        {courseDetails && courseDetails.shortDescription && translateSync(courseDetails?.shortDescription)
                          .split(" ")
                          .slice(3, 6)
                          .join(" ") + "..."}
                      </p>

                    </div>
                    <div className="vr mx-3"></div>
                    {/* <div className="text-center">
                      <h5 className="fw-bold text-bg-light-color  mb-3"  >{overallRating.ratingScore}</h5>
                      <p className="text-muted">{overallRating.reviewCount ? (overallRating.reviewCount) : "0 review"}</p>
                    </div> */}
                    {/* <div className="vr mx-3"></div> */}
                    <div className="text-center">
                      <img src="/img/members.png" alt="Language" className="img-fluid rounded mt-3" style={{ width: "30px", height: "30px" }} />
                      <p className="mt-2 mb-1">0</p>
                      <p className="text-muted" >{translateSync('learners')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-lg-6 mb-4" data-aos="fade-left" data-aos-delay="200">
              <div className="d-flex mt-3 mb-3 trainingimggg secpartt">
                {isLogin ?
                  <>
                    {isPurchaseCart ?
                      <>
                        <center>

                          <button className="btn btn-primary bg-light-color addtocartt text-white" disabled>{translateSync('Course Purchased')}</button>
                        </center>
                      </>
                      :
                      <>
                        <button className="btn btn-primary  bg-light-color addtocartt text-white" onClick={() => addToCart(courseDetails.id)}>{isAddToCart ? translateSync("Course Added") : translateSync("Add to Cart")}</button>
                        <button className="btn btn-primary bg-light-color text-white" onClick={() => buyNow(courseDetails.id)}>{translateSync('Buy Now')}</button>
                      </>
                    }

                  </>
                  :
                  <>
                    <button className="btn btn-primary bg-light-color addtocartt text-white" data-bs-toggle="modal" data-bs-target="#loginModal" >{translateSync('Add to Cart')}</button>
                    <button className="btn btn-primary bg-light-color text-white" data-bs-toggle="modal" data-bs-target="#loginModal" >{translateSync('Buy Now')}</button>


                  </>}

              </div>
            </div>

          </div>

        </section>




        <section className="moduletabb py-5 pt-2">
          <div className="container mt-3">
            <ul className="nav nav-tabs" data-aos="zoom-in" data-aos-delay="200">
              <li className="nav-item">
                <button
                  className={`nav-link trainingpage ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  {translateSync('Overview')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link trainingpage ${activeTab === "modules" ? "active" : ""}`}
                  onClick={() => setActiveTab("modules")}
                >
                  {translateSync('Curriculum')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link trainingpage ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  {translateSync('Reviews')}
                </button>
              </li>
            </ul>

            <div className="mt-0">
              {activeTab === "overview" && (
                <div class="single-course-area one ptb-100" data-aos="fade-up" data-aos-delay="200">
                  <div class="tabs_item">
                    {/* {} */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: translateSync(courseDetails.description),
                      }}
                    >

                    </div>

                  </div>
                </div>

              )}
              {activeTab === "modules" &&

                <div class="single-course-area ptb-100" data-aos="fade-up" data-aos-delay="200">
                  <div class="curriculum-content" data-aos="fade-up" data-aos-delay="200">
                    <CurriculumList curriculum={courseDetails.curriculam} />

                    {/* <div class="curriculum-list">
                      <h4>Unit 1: Fundamentals of Risk Management</h4>

                      <ul>
                        <li>
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Definition and Importance of Risk Management in Strategy
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>

                        <li class="transparent">
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Types of Risks Impacting Organizations
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>

                        <li>
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Key Concepts and Terminology
                          </a>
                          <a href="single-course.html" class="meet-time">

                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>
                      </ul>
                    </div>

                    <div class="curriculum-list">
                      <h4>Unit 2: Identifying and Assessing Risks</h4>

                      <ul>
                        <li>
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Techniques for Risk Identification (SWOT Analysis, PESTEL)
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>

                        <li class="transparent">
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Risk Assessment and Evaluation Frameworks
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>

                        <li>
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Tools for Quantifying and Qualifying Risks
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>
                      </ul>
                    </div>

                    <div class="curriculum-list">
                      <h4>Unit 3: Integrating Risk Management into Strategic Planning</h4>

                      <ul>
                        <li>
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                            Developing Risk Management Strategies Aligned with Business Objectives
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>

                        <li class="transparent">
                          <a href="instructors.html" class="meet-title">
                            <img src="/img/document.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />
                            Incorporating Risk Analysis into Strategic Decision-Making
                          </a>
                          <a href="single-course.html" class="meet-time">
                            <img src="/img/lock.png" alt="Language" className="img-fluid rounded" style={{ width: "20px", height: "20px", marginRight: "10px" }} />

                          </a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>

              }
              {activeTab === "reviews" &&





                <div class="single-course-area ptb-100" >
                  <div className="container mt-4 ">
                    <div className="d-flex">


                      {isLogin ?

                        <div className="writee-revieww-btnnn">
                          <button type="button" class="btn btn-primary bg-light-color" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            {translateSync('Write a Review')}
                          </button>
                        </div>
                        : ""
                      }


                      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h4 className="fw-bold ">{translateSync('Write a Review')}</h4>

                              {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-bs-label="Close">

        </button> */}

                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <Formik
                              initialValues={{
                                name: userDetails.name || "",
                                email: userDetails.email || "",
                                feedback: "",
                                rating: 0, // Default rating
                              }}
                              validationSchema={SigninSchema}

                              onSubmit={(values) => {
                                // console.log(values, "values");
                                formSubmit(values); // Make sure `formSubmit` is defined
                              }}

                            >
                              {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                                <Form>
                                  <div className="modal-body">
                                    <div className="row mb-3">
                                      <div className="col">
                                        <input
                                          name="name"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          placeholder={translateSync("Your name ")}
                                          type="text"
                                          value={values.name || ''}
                                          className='form-control'
                                        />
                                        <span className="focus-border"></span>
                                        {errors.name && touched.name && <div className="error_msg">{errors.name}</div>}
                                      </div>
                                      <div className="col">
                                        <input
                                          name="email"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          placeholder={translateSync("Email ")}
                                          type="email"
                                          value={values.email || ""}
                                          className='form-control'
                                        />
                                        <span className="focus-border"></span>
                                        {errors.email && touched.email && <div className="error_msg">{errors.email}</div>}
                                      </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="mb-3">
                                      <div className="col">
                                        <label className="form-label">{translateSync('Star Rating')}*</label>
                                        {errors.rating && touched.rating && <div className="error_msg">{errors.rating}</div>}
                                        <div className="d-flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                              key={star}
                                              className="me-2"
                                              style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                                color: star <= values.rating ? "#ffc107" : "#e4e5e9",
                                              }}
                                              onClick={() => setFieldValue("rating", star)}
                                            >
                                              ★
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-3">
                                      <div className="col">
                                        <textarea
                                          name="feedback"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          placeholder="Your Feedback *"
                                          rows="4"
                                          className='form-control'
                                        ></textarea>
                                        <span className="focus-border"></span>
                                        {errors.feedback && touched.feedback && <div className="error_msg">{errors.feedback}</div>}
                                      </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary bg-light-color text-white">
                                      {translateSync('Submit')}
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>

                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="reviewsection-training mb-5">

                      <ReviewList reviews={reviews} />
                    </div>


                  </div>

                </div>
              }
            </div>
          </div>
        </section>



        <div className="modal fade" id="loginModal" tabIndex="-1" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
          <div className="modal-dialog">
            <div className="modal-content flip-container">
              <div className={`flipper ${isRegistering ? "flip" : ""}`}>
                <div class="modal-header">
                  <h4 className="fw-bold ">{translateSync('Login')}</h4>

                  {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-bs-label="Close">

        </button> */}

                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                {/* 🔹 LOGIN FORM */}
                <div className="modal-body front rbt-contact-form contact-form-style-1 max-width-auto">

                  <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={loginSubmit}>
                    {({ errors, touched, handleChange, handleBlur }) => (
                      <Form>

                        <div className="">
                          <input name="email" className='form-control' onChange={handleChange} onBlur={handleBlur} placeholder="Email *" autoComplete="email" type="email" />
                          {errors.email && touched.email && <div className="error_msg">{errors.email}</div>}
                          <br></br>
                        </div>
                        <div className="">
                          <input name="password" className='form-control' onChange={handleChange} onBlur={handleBlur} placeholder="Password *" autoComplete="current-password" type="password" />
                          {errors.password && touched.password && <div className="error_msg">{errors.password}</div>}
                          <br></br>
                        </div>
                        <button type="submit" className="rbt-btn w-100">{translateSync('Log In')}</button>

                        <p className="text-center">
                          <br></br>
                          {translateSync("Don't have an account?")} <span className="regnavicon" onClick={() => setIsRegistering(true)}>{translateSync('Register Now!')}</span>
                        </p>
                      </Form>
                    )}
                  </Formik>
                </div>

                {/* 🔹 REGISTER FORM */}
                <div className="modal-body back contact-form-style-1 max-width-auto">
                  <div class="modal-header">
                    <h4 className="fw-bold ">{translateSync('Register')}</h4>

                    {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-bs-label="Close">

        </button> */}

                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <Formik initialValues={{ userName: "", regEmail: "", regPassword: "", confirmPassword: "" }} validationSchema={SignupSchema} onSubmit={registerSubmit}>
                    {({ errors, touched, handleChange, handleBlur }) => (
                      <Form>
                        <br></br>
                        <div className="">
                          <input name="userName" className='form-control' onChange={handleChange} onBlur={handleBlur} placeholder={translateSync("Username")} autoComplete="username" type="text" />
                          {errors.userName && touched.userName && <div className="error_msg">{errors.userName}</div>}
                          <br></br>
                        </div>
                        <div className="">
                          <input name="regEmail" className='form-control' onChange={handleChange} onBlur={handleBlur} placeholder={translateSync("Email")} autoComplete="email" type="email" />
                          {errors.regEmail && touched.regEmail && <div className="error_msg">{errors.regEmail}</div>}
                          <br></br>
                        </div>
                        <div className="">
                          <input name="regPassword" className='form-control' onChange={handleChange} onBlur={handleBlur} placeholder={translateSync("Password")} autoComplete="new-password" type="password" />
                          {errors.regPassword && touched.regPassword && <div className="error_msg">{errors.regPassword}</div>}
                          <br></br>
                        </div>
                        <div className="">
                          <input name="confirmPassword" className='form-control' onChange={handleChange} onBlur={handleBlur} placeholder={translateSync("Confirm Password")} autoComplete="new-password" type="password" />
                          {errors.confirmPassword && touched.confirmPassword && <div className="error_msg">{errors.confirmPassword}</div>}
                          <br></br>
                        </div>
                        <button type="submit" className="rbt-btn w-100">{translateSync('Register')}</button>

                        <p className="text-center">
                          <br></br>
                          {translateSync('Already have an account?')} <span className="regnavicon" onClick={() => setIsRegistering(false)}>{translateSync('Login.')}</span>
                        </p>
                      </Form>
                    )}
                  </Formik>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
export default TrainingDetailPage;