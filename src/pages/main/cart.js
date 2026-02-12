import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import apiProvider from "../../apiProvider/categoryApi";
import ApiProvider from "../../apiProvider/addToCartApi";
import { IMAGE_URL } from "../../network/apiClient";
import './myaccount.css';
import { useTranslation } from "../../context/TranslationContext";


const CartPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    const isAuthenticated = useSelector((state) => state.auth.token);
    const courseDatas = useSelector((state) => state.training);
    const [courseDetails, setCourseDetails] = useState([])
    const [cartListDetails, setCartListDetails] = useState([])
    const [totalPrice, setTotalPrice] = useState("0")



    useEffect(() => {
        if (courseDatas && courseDatas.isGetList) {
            getCourseDetails(courseDatas.id);

        }
    }, [courseDatas]);

    const getCourseDetails = async (id) => {
        const result = await apiProvider.getCourseDet(id);
        // console.log(result, "eeeeeeeee");

        if (result && result.status && result.response) {
            setCourseDetails(result.response.data)
        }
    };

    const getCartDetails = async (id) => {
        const result = await ApiProvider.getCart();
        if (result && result.response && result.response.data && result.response.data.cartDetails.length > 0) {

            setCartListDetails(result.response.data.cartDetails)
            setTotalPrice(result.response.data.totalPrice)
        }
    };

    useEffect(() => {
        getCartDetails()

    }, [])


    const Checkout = async (id) => {
        navigate("/checkout?type=addToCart");
    }

    const removeItem = async (id) => {
        // Remove item locally first
        setCartListDetails(prev => prev.filter(item => item.id !== id));

        // Call API to remove from backend
        const result = await ApiProvider.removeToCart(id);
        console.log(result);


        // Optionally re-fetch to ensure sync
        if (result) {
            getCartDetails();
        } else {
            // Optionally show an error message
            alert("Failed to remove item from server.");
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (

        <>
            <Helmet>
                <title>e-learning solutions UAE | iLap</title>
                <meta
                    name="keywords"
                    content="team building workshops, competency assessments UAE, executive coaching Dubai, executive coaching Dubai, digital learning programs UAE, Arabic corporate training UAE, HR training courses Saudi Arabia"
                />

            </Helmet>

            <div>
                <section className="Home-banner-3  text-white py-5 position-relative">
                    <div className="container d-flex flex-column flex-md-row align-items-center">
                        <div className="col-md-12 text-center  home-header" >
                            <div className="innerbanner-txt ">
                                <h1 className="fw-bold text-center display-5  font-51">{translateSync('Cart')}</h1>
                            </div>
                        </div>
                    </div>
                </section>

                {cartListDetails && cartListDetails.length === 0 ? (
                    <div className="text-center py-5">
                        <img
                            src="/img/emptycart.png"
                            alt="Empty Cart"
                            className="img-fluid"
                            style={{ width: "500px", marginBottom: "20px" }}
                        />
                        <h4>{translateSync('Your cart is empty')}</h4>
                        <p>{translateSync("Looks like you haven’t added anything yet.")}</p>
                        <button
                            className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y mt-3"
                            onClick={() => navigate(`/training/${courseDatas.id}`)}
                        >
                            <span data-text={translateSync("Browse Courses")}>{translateSync('Browse Courses')}</span>
                        </button>
                    </div>
                ) : (
                    <section className="py-5">
                        <div className="rbt-cart-area bg-color-white rbt-section-gap">
                            <div className="cart_area">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12 col-lg-8">
                                            <form action="#">
                                                <div className="cart-table table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th className="pro-thumbnail">{translateSync('Image')}</th>
                                                                <th className="pro-title">{translateSync('Course Name')}</th>
                                                                <th className="pro-subtotal">{translateSync('Price')}</th>
                                                                <th className="pro-remove">{translateSync('Remove')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cartListDetails.map((ival) => (
                                                                <tr key={ival.id}>
                                                                    <td className="pro-thumbnail">
                                                                        <img
                                                                            src={IMAGE_URL + ival.categoryImage}
                                                                            alt="Product"
                                                                            style={{ width: "70px" }}
                                                                        />
                                                                    </td>
                                                                    <td className="pro-title text-decoration-none">
                                                                        <h6 className="pro-title text-decoration-none">{translateSync(ival.categoryName)}</h6>
                                                                        <p>{translateSync(ival.courseName)}</p>
                                                                    </td>
                                                                    <td className="pro-subtotal"><span>$ {ival.offerPrice ? ival.offerPrice : ival.price}</span></td>
                                                                    <td className="pro-remove" onClick={() => removeItem(ival.id)}>
                                                                        <a href="#">
                                                                            <img
                                                                                src="/img/cancel.png"
                                                                                alt="Remove"
                                                                                className="img-fluid rounded"
                                                                                style={{ width: "20px", height: "20px" }}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="cart-summary">
                                                <div className="cart-summary-wrap">
                                                    <div className="section-title text-start">
                                                        <h4 className="title mb--30">{translateSync('Cart Summary')}</h4>
                                                    </div>
                                                    <p>{translateSync('Sub Total')} <span>$  {totalPrice ? (totalPrice * 0.95).toFixed() : 0}</span></p>
                                                    <p>
                                                        *{translateSync('VAT Included')} <span> {courseDetails.price ? '5%' : '0'}</span>                                                </p>
                                                    <h2>{translateSync('Grand Total')} <span>$ {totalPrice}</span></h2>
                                                </div>
                                                <center>

                                                    <div className="cart-submitbtngroup">
                                                        <div className="single-button w-50">
                                                            <button
                                                                className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y w-100"
                                                                type="button"
                                                                onClick={() => (isAuthenticated ? Checkout() : navigate("/login"))}
                                                            >
                                                                <span data-text={translateSync("Checkout")}>{translateSync('Checkout')}</span>
                                                            </button>
                                                        </div>
                                                        {/* <div className="single-button w-50">
                                        <button className="rbt-btn rbt-switch-btn rbt-switch-y w-100 btn-border">
                                            <span data-text="Update Cart">Update Cart</span>
                                        </button>
                                    </div> */}
                                                    </div>
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            </div>

        </>
    )
}

export default CartPage;