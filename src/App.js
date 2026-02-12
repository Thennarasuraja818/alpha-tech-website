import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from './pages/header/header';
import HomePage from './pages/main/home';
import FooterPage from './pages/footer/footer';
import ProductListing from './pages/products/ProductListing';
import CartPage from './pages/cart/CartPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AboutPage from './pages/main/about';
import TrainingDetailPage from './pages/main/training-detail';
import ProgramPage from './pages/main/program';
import FacilitatorCard from './pages/main/facilitator';
import ProfileGrid from './pages/main/team';
import TrainingPage from './pages/main/training';
import TeamDetailPage from './pages/main/team-details';
import MyAccountPage from './pages/main/myaccount';
import CheckoutPage from './pages/main/checkout';
// import CartPage from './pages/main/cart';
import LoginPage from './pages/main/login';
import RegisterPage from './pages/main/register';
import ContactPage from './pages/main/contact';
import FacilitatorDetailPage from './pages/main/facilitator-detail';
import ProtectedRoute from "./pages/ProtectedRoute";
import EmailVerify from './pages/main/verify';
import PaymentSuccess from './pages/main/paymentSuccess';
import CourseInvoice from './pages/main/invoice';
import Podcost from './pages/main/podcost';
import CalendarPage from './pages/main/calendar';
import CourseCalendar from './pages/main/calendarone';
import CorporateForm from './pages/main/corporateForm';
import TermsPage from './pages/main/terms';
import PrivacyPage from './pages/main/privacy';
import ApplicationsPage from './pages/main/applications';
import ResourcesPage from './pages/main/resources';

// import CookieConsent from './pages/CookieConsent '; // Removed
import { useTranslation } from './context/TranslationContext';
// import LanguageSwitcher from './components/LanguageSwitcher';

import ProductsMain from './pages/products/ProductsMain';
import SubcategoryVariants from './pages/products/SubcategoryVariants';
import ProductSpecs from './pages/products/ProductSpecs';
import PageAccount from './pages/main/pageAccount';

function App() {
  const { translateSync, currentLanguage } = useTranslation();

  // const location = useLocation();
  // const isVerifyRoute = location.pathname.startsWith('/verify/');
  return (
    <div className="App">

      {/* <BrowserRouter> */}

      <Header />
      {/* <LanguageSwitcher /> */}
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/payment-success' element={<PaymentSuccess />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/register' element={<RegisterPage />} />
        <Route exact path='/contact' element={<ContactPage />} />
        <Route exact path='/corporate' element={<CorporateForm />} />
        <Route exact path="/terms" element={<TermsPage />} />
        <Route exact path="/privacy" element={<PrivacyPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Products */}
        <Route path="/products" element={<ProductsMain />} />
        {/* <Route path="/products/:subcategoryId" element={<ProductListing />} /> */}
        <Route path="/products/:subCategoryId" element={<SubcategoryVariants />} />
        <Route path="/products/:subCategoryId/:variantId" element={<ProductSpecs />} />
        <Route path="/cart" element={<CartPage />} />

        {/* New Pages */}
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path='/about' element={<AboutPage />} />

        {/* Existing Routes */}
        <Route path='/facilitator' element={<FacilitatorCard />} />
        <Route path='/facilitator-detail/:slug' element={<FacilitatorDetailPage />} />

        <Route path='/team' element={<ProfileGrid />} />
        <Route path='/training/:id' element={<TrainingPage />} />
        {/* <Route path='/podcast' element={<PodcastPage />} /> */}
        <Route path='/training-detail/:courseId' element={<TrainingDetailPage />} />
        <Route path='/team-details/:slug' element={<TeamDetailPage />} />

        <Route path='/verify/:token' element={<EmailVerify />} />

        <Route exact path='/invoice' element={<CourseInvoice />} />

        <Route exact path='/podcast' element={<Podcost />} />

        <Route exact path='/calendar' element={<CalendarPage />} />

        <Route exact path='/calendarone' element={<CourseCalendar />} />

        <Route path='/cart' element={<ProtectedRoute element={<CartPage />} />} />
        <Route exact path="/myaccount" element={<ProtectedRoute element={<MyAccountPage />} />} />
        <Route exact path="/checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />
        <Route exact path="/pageaccount" element={<ProtectedRoute element={<PageAccount />} />} />


      </Routes>
      <FooterPage />
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Cookie consent removed */}
    </div>
  );
}

export default App;
