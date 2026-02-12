import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useTranslation } from '../../context/TranslationContext';

// import './CorporateTraining.css';


const CorporateForm = () => {
        const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();

    const testimonials = [
        {
            text: `"iLap's corporate training transformed our leadership team. The customized approach delivered measurable results in just weeks."`,
            author: "Ahmed K., HR Director"
        },
        {
            text: `"The sales training program exceeded expectations. Our team implemented the strategies immediately with great success."`,
            author: "Sarah M., Sales VP"
        },
        {
            text: `"Exceptional facilitators who understood our industry challenges. The ROI was evident within the first quarter."`,
            author: "Fatima R., COO"
        }
    ];

    const programs = [
        {
            title: "Leadership & Management",
            description: "Build strategic thinkers, confident leaders, and high-performing teams.",
            icon: "/img/corporate/leadership and management 2.png",
            isTop: true
        },
        {
            title: "Customer Service",
            description: "Equip teams to resolve challenges and deliver exceptional service experiences.",
            icon: "/img/corporate/customer-service 3.png",
            isTop: true
        },
        {
            title: "Sales & Marketing",
            description: "Drive smarter growth with persuasive storytelling and modern tactics.",
            icon: "/img/corporate/marketing and sales.png",
            isTop: true
        },
        {
            title: "Communication & Soft Skills",
            description: "Foster clarity, collaboration, and emotional intelligence across teams.",
            icon: "/img/corporate/soft skills 2.png",
            isTop: true
        },
        {
            title: "Administration & Secretarial Excellence",
            description: "Enhance organization, support, and executive efficiency.",
            icon: "/img/corporate/administration.png",
            isTop: true
        },
        {
            title: "Strategy & Planning",
            description: "Align departments and set your organization up for long-term success.",
            icon: "/img/corporate/strategy and planning.png"
        },
        {
            title: "Artificial Intelligence",
            description: "Leverage AI to Drive Innovation and Growth",
            icon: "/img/corporate/Artificial Intelligence.png"
        },
        {
            title: "Digital Transformation",
            description: "Navigate Change and Embrace New Technologies",
            icon: "/img/corporate/digital-transformation.png"
        },
        {
            title: "Human Resources",
            description: "Talent management, organizational design, and workplace culture",
            icon: "/img/corporate/HR.png"
        },
        {
            title: "Finance & Accounting",
            description: "Strengthening financial skills and decision-making",
            icon: "/img/corporate/finance 3.png"
        },
        {
            title: "Insurance",
            description: "Understanding products, policies, and the market for different types of insurance.",
            icon: "/img/corporate/insurance.png"
        },
        {
            title: "Real Estate",
            description: "Maximize Returns in the Property Market",
            icon: "/img/corporate/real estate.png"
        },
        {
            title: "Healthcare Management",
            description: "Improve Operations and Patient Care",
            icon: "/img/corporate/healthcare management.png"
        },
        {
            title: "Procurement & Supply Chain",
            description: "Streamlining operations and boosting efficiency",
            icon: "/img/corporate/supply chain.png"
        },
        {
            title: "Information Technology",
            description: "Applying modern tech to real business challenges",
            icon: "/img/corporate/IT.png"
        },
        {
            title: "Project Management",
            description: "Building practical skills for planning and execution",
            icon: "/img/corporate/project management.png"
        },
        {
            title: "Engineering & Technical",
            description: "Advancing technical capabilities across disciplines",
            icon: "/img/corporate/engineering.png"
        },
        {
            title: "Oil & Gas",
            description: "Specialized programs tailored to industry-specific needs",
            icon: "/img/corporate/oil and gas.png"
        }
    ];

    const benefits = [
        {
            title: "Customized Programs",
            description: "Tailored training that aligns perfectly with your goals and teams' challenges."
        },
        {
            title: "Expert Facilitators",
            description: "Learn from experienced and certified professionals with deep real-world insight."
        },
        {
            title: "Flexible Delivery",
            description: "On-site, online, or hybrid; we adapt to your workflow."
        },
        {
            title: "Regional Experience",
            description: "Trusted by leading organizations and Government entities across the EMEA."
        },
        {
            title: "Actionable Outcomes",
            description: "We prioritize skills that your teams can implement from day one."
        }
    ];

    const processSteps = [
        {
            title: "Understand Your Needs",
            description: "We begin by understanding your organization's structure, objectives, and challenges."
        },
        {
            title: "Craft Your Program",
            description: "We craft a custom solution from a single workshop to a full year roadmap."
        },
        {
            title: "Deliver, Measure, Evolve",
            description: "We deliver, evaluate, and refine to ensure long-term impact and ROI."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Corporate Training Solutions | iLap Training</title>
                <meta
                    name="description"
                    content="Tailored B2B training solutions designed to meet your organization's specific goals and enhance employee performance."
                />
            </Helmet>

            {/* Hero Section */}
            <section className="corporate-hero">
                <div className="corporate-hero__overlay">
                    <div className="container">
                        <div className="corporate-hero__content">
                            <h1 className="corporate-hero__title">{translateSync('Corporate Training Solutions That Empower Real Results')}</h1>
                            <p className="corporate-hero__subtitle">
                                {translateSync("We provide tailored B2B training solutions designed to meet your organization's goals, enhance performance, and drive sustainable growth.")}"
                            </p>
                            <div className="corporate-hero__cta">
                                {/* <button className="corporate-hero__btn corporate-hero__btn--primary">Request a Custom Proposal</button> */}

                                <button className="rbt-btn btn-gradient banner-btn rbt-switch-btn  " ><a href="/contact" >
                                    <span data-text={translateSync("Request a Custom Proposal")} style={{ color: "white" }}>{translateSync('Request a Custom Proposal')}</span>
                                </a>
                                </button>
                                {/* <button className="rbt-btn btn-gradient banner-btn rbt-switch-btn  " ><a href="/contact" >
                                    <span data-text="Talk to Us" style={{ color: "white" }}>Talk to Us</span>
                                </a>
                                </button> */}
                                {/* <button className="corporate-hero__btn corporate-hero__btn--secondary">Talk to Us</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Partner With Us */}
            <section className="corporate-benefits py-5 Carousel-section">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <h2 className="fw-bold text-white">{translateSync('Why Partner with Us?')}</h2>
                    </div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div className="benefit-card" key={index}>
                                <div className="process-step__number">{index + 1}</div>
                                <h3 className="benefit-card__title">{translateSync(benefit.title)}</h3>
                                <p className="benefit-card__description">{translateSync(benefit.description)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Training Programs */}
            {/* <section className="corporate-programs py-5 bg-light">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <h2 className="section-title">(Value) Trainers – (Value) Learners – 6 Locations</h2>
                        <p className="section-subtitle">Our comprehensive training programs</p>
                    </div>

                    <div className="flip-cards-container">
                        {programs.map((program, index) => (
                            <div className="flip-card" key={index}>
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <div className="card-content">
                                            <img src={program.icon} alt={program.title} />
                                            <br></br>
                                            <strong className="text-dark text-bg-dark-color">{program.title}</strong>                                        </div>
                                    </div>
                                    <div className="flip-card-back">
                                        <div className="card-content">
                                            <p>{program.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Our Process */}
            <section className="corporate-process py-5 ">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <h2 className="section-title fw-bold">{translateSync('How We Bring Training to Life')}</h2>
                    </div>

                    <div className="process-steps">
                        {processSteps.map((step, index) => (
                            <div className="process-step" key={index}>
                                <div className="process-step__number">{index + 1}</div>
                                <h3 className="process-step__title">{translateSync(step.title)}</h3>
                                <p className="process-step__description">{translateSync(step.description)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="training-section">
                <div className="content-container">
                    <div className="heading-container">
                        {/* <h2 className="section-title text-white">24 Trainers - +10,000 Learners - 6 Locations</h2> */}
                        <h2 className="fw-bold text-white">
                            {translateSync('Our comprehensive training programs')}
                        </h2>
                    </div>

                    <div className="flip-cards-container">
                        {programs.map((program, index) => (
                            <div className="flip-card" key={index} style={{ height: "200px", cursor: "pointer" }}>
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <div className="card-content">
                                            <img src={program.icon} alt={program.title} className="flip-card-icon" style={{ width: "70px" }} />
                                            <br></br>
                                            <strong className="text-dark text-bg-dark-color">{translateSync(program.title)}</strong>
                                        </div>
                                    </div>
                                    <div className="flip-card-back">
                                        <div className="card-content">
                                            <p>{translateSync(program.description)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Testimonials */}
            <section className="corporate-testimonials py-5 bg-light">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <h2 className="section-title">{translateSync('What Our Clients Say')}</h2>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        loop={true}
                        className="testimonials-swiper "
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="testimonial-card bg-white shadow-sm p-4 rounded" style={{}}>
                                    <div className="testimonial-card__content">
                                        <p className="testimonial-card__text">"{translateSync(testimonial.text)}"</p>
                                        <p className="testimonial-card__author">— {translateSync(testimonial.author)}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* CTA Section */}
            <section className="corporate-cta py-5">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-card__content">
                            <h2 className="cta-card__title">{translateSync('Transform Your Teams')}</h2>
                            <p className="cta-card__text">
                                {translateSync("Take the first step towards stronger, more capable teams. Request a custom proposal tailored to your organization's unique needs.")}
                            </p>
                            {/* <button className="cta-card__btn">Get Started Today</button> */}
                            <button className="rbt-btn btn-gradient banner-btn rbt-switch-btn  " ><a href="/contact" >
                                <span data-text={translateSync("Get Started Toda")} style={{ color: "white" }}>{translateSync('Get Started Today')}</span>
                            </a>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CorporateForm;