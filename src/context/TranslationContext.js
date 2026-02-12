import React, { createContext, useContext, useState, useEffect } from 'react';
import translationsData from './translations.json'; // Import your JSON file

const TranslationContext = createContext(null);

export const TranslationProvider = ({
  children,
  initialLanguage = 'en'
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [translations, setTranslations] = useState(translationsData);

  useEffect(() => {
    const storedLang = localStorage.getItem('currentLanguage');
    if (storedLang) {
      setCurrentLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentLanguage', currentLanguage);
  }, [currentLanguage]);

  const translateSync = (text) => {
    if (currentLanguage === 'en') return text;
    
    // Look for exact match first
    if (translations[currentLanguage] && translations[currentLanguage][text]) {
      return translations[currentLanguage][text];
    }
    
    // If no exact match, try case-insensitive search
    const normalizedText = text?.toLowerCase().trim();
    const langTranslations = translations[currentLanguage] || {};
    
    const matchingKey = Object.keys(langTranslations).find(
      key => key.toLowerCase().trim() === normalizedText
    );
    
    if (matchingKey) {
      return langTranslations[matchingKey];
    }
    
    // If no translation found, return the original text
    return text;
  };

  const translateValues = (data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, translateSync(value)]
    ));
  };

  return (
    <TranslationContext.Provider
      value={{
        translateSync,
        translateValues,
        currentLanguage,
        setCurrentLanguage,
        translations
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within a TranslationProvider');
  return context;
};
