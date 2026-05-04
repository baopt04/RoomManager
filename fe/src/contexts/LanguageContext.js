import React, { createContext, useState, useContext, useEffect } from 'react';
import vi from '../locales/vi';
import en from '../locales/en';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'vi');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key) => {
    const keys = key.split('.');
    let dict = language === 'vi' ? vi : en;
    for (const k of keys) {
      if (dict[k] === undefined) return key;
      dict = dict[k];
    }
    return dict;
  };

  // Nếu là tiếng Việt -> Giữ nguyên
  // Nếu là tiếng Anh -> Bỏ dấu tiếng Việt (Ví dụ: Tứ Liên -> Tu Lien)
  const tName = (name) => {
    if (!name) return name;
    if (language === 'vi') return name;
    return name
      .normalize('NFD') // Tách dấu ra khỏi chữ cái
      .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, tName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
