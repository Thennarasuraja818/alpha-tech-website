import { useEffect } from "react";
const ProgramPage = () => {

    // Knowledge Area Data
    const knowledgeAreas = [
        { title: "Customer Service", image: "/img/programs/program-img-1.png" },
        { title: "Leadership and Management", image: "/img/programs/program-img-2.png" },
        { title: "Personal & Development Skills", image: "/img/programs/program-img-3.png" },
        { title: "Sales and Marketing", image: "/img/programs/program-img-4.png" },
        { title: "Administration and Secretarial", image: "/img/programs/program-img-5.png" },
        { title: "Strategy and Strategic Planning", image: "/img/programs/program-img-6.png" }
    ];
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <>
            <div className="container my-5" style={{ paddingTop: "100px" }}>
                <h3 className="text-center text-bg-light-color fw-bold mb-4">Knowledge Areas</h3>
                {/* Knowledge Areas Grid */}
                <div className="row">
                    {/* Online Class */}
                    <div className="col-md-5">
                        <h5 className="text-left fw-bold mb-3" style={{ textAlign: "left", paddingBottom: "10px" }}>Online Class</h5>
                        <div className="row g-3">
                            {knowledgeAreas.map((item, index) => (
                                <div key={index} className="col-4">
                                    <div className="program-card position-relative">
                                        <img src={item.image} className="img-fluid rounded" alt={item.title} />
                                        <div className="overlay">
                                            <p className="fw-bold text-white">{item.title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="col-md-2 d-flex justify-content-center align-items-center">
                        <div className="border-end h-100"></div>
                    </div>

                    {/* Classroom */}
                    <div className="col-md-5">
                        <h5 className="text-left fw-bold mb-3" style={{ textAlign: "left", paddingBottom: "10px" }}>Classroom</h5>
                        <div className="row g-3">
                            {knowledgeAreas.map((item, index) => (
                                <div key={index} className="col-4">
                                    <div className="program-card position-relative">
                                        <img src={item.image} className="img-fluid rounded" alt={item.title} />
                                        <div className="overlay">
                                            <p className="fw-bold text-white">{item.title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Certification & Training Locations */}
                <div className="bg-light mt-5 p-4 rounded shadow-sm" style={{ boxShadow: " 0px 0px 10.3px 0px #00000040" }}>
                    <div className="row">
                        {/* Certification */}
                        <div className="col-md-5 text-center">
                            <h5 className="fw-bold">Our Certification</h5>
                            <p>We offer internationally recognized and industry-approved training to ensure high-quality education.</p>
                            <div className="d-flex justify-content-center">
                                <img src="/img/dubai-img.png" alt="Dubai Knowledge" className="me-3" width="100" />
                                <img src="/img/crd-certified.png" alt="CPD Certified" width="150" />
                            </div>
                        </div>
                        {/* Vertical Divider */}
                        <div className="col-md-2 d-flex justify-content-center align-items-center">
                            <div className="border-end h-100"></div>
                        </div>
                        {/* Training Locations */}
                        <div className="col-md-5 text-center">
                            <h5 className="fw-bold">Training Locations</h5>
                            <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                                {["Abu Dhabi", "Jeddah", "Dubai", "Manama", "Riyadh", "Dammam"].map((location, index) => (
                                    <span key={index} className="fw-semibold text-muted">{location}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ProgramPage;