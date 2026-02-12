import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer, toast } from 'react-toastify';

import './index.css';
import './rtl.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from "./redux/store";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { HelmetProvider } from 'react-helmet-async';
import { TranslationProvider } from './context/TranslationContext'; // Import the provider
import './industrial-theme.css';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer />
      <BrowserRouter>
        <HelmetProvider>
          <TranslationProvider> {/* Wrap App with TranslationProvider */}
            <App />
          </TranslationProvider>
        </HelmetProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

reportWebVitals();
