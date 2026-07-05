import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { getTranslations, type TranslationKey } from '../data/translations';

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SETTINGS_KEY = 'veilpay_settings';

const readLanguageFromStorage = (): string => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return 'en';
    const parsed = JSON.parse(raw) as { language?: string };
    return parsed.language ?? 'en';
  } catch {
    return 'en';
  }
};

const writeLanguageToStorage = (lang: string): void => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const current = raw ? JSON.parse(raw) as Record<string, unknown> : {};
    current.language = lang;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  } catch {
    // localStorage unavailable
  }
};

const interpolate = (template: string, params?: Record<string, string | number>): string => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<string>(() => readLanguageFromStorage());

  const setLang = useCallback((newLang: string) => {
    setLangState(newLang);
    writeLanguageToStorage(newLang);
  }, []);

  useEffect(() => {
    const dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = getTranslations(lang);
    const template = dict[key] ?? getTranslations('en')[key] ?? key;
    return interpolate(template, params);
  }, [lang]);

  const value = useMemo<LanguageContextType>(() => ({
    lang,
    setLang,
    t,
    isRTL: RTL_LANGUAGES.includes(lang),
  }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
