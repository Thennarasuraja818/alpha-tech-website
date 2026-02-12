// import React from 'react';
// import { useTranslation } from '../context/TranslationContext';

// const LanguageSwitcher = () => {
//   const { currentLanguage, setCurrentLanguage } = useTranslation();

//   const handleLanguageChange = (lang) => {
//     setCurrentLanguage(lang);
//     document.documentElement.lang = lang;
//     document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
//   };

//   return (
//     <div className="language-switcher">
//       <button 
//         onClick={() => handleLanguageChange('en')} 
//         className={currentLanguage === 'en' ? 'active' : ''}
//       >
//         English
//       </button>
//       <button 
//         onClick={() => handleLanguageChange('ar')} 
//         className={currentLanguage === 'ar' ? 'active' : ''}
//       >
//         العربية
//       </button>
//     </div>
//   );
// };

// export default LanguageSwitcher;