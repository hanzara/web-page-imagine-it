import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "nav.overview": "Overview",
    "nav.payments": "Payments", 
    "nav.wallets": "Wallets",
    "nav.cards": "Cards",
    "nav.analytics": "Analytics",
    "nav.customers": "Customers",
    "nav.profile": "Profile",
    "nav.home": "Home",
    "nav.notifications": "Notifications",
    "theme.light": "Light",
    "theme.dark": "Dark", 
    "theme.system": "System"
  },
  es: {
    "nav.overview": "Resumen",
    "nav.payments": "Pagos",
    "nav.wallets": "Billeteras", 
    "nav.cards": "Tarjetas",
    "nav.analytics": "Análisis",
    "nav.customers": "Clientes",
    "nav.profile": "Perfil",
    "nav.home": "Inicio",
    "nav.notifications": "Notificaciones",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.system": "Sistema"
  },
  fr: {
    "nav.overview": "Aperçu",
    "nav.payments": "Paiements",
    "nav.wallets": "Portefeuilles",
    "nav.cards": "Cartes", 
    "nav.analytics": "Analytique",
    "nav.customers": "Clients",
    "nav.profile": "Profil",
    "nav.home": "Accueil",
    "nav.notifications": "Notifications",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système"
  },
  de: {
    "nav.overview": "Übersicht",
    "nav.payments": "Zahlungen",
    "nav.wallets": "Geldbörsen",
    "nav.cards": "Karten",
    "nav.analytics": "Analytik", 
    "nav.customers": "Kunden",
    "nav.profile": "Profil",
    "nav.home": "Startseite",
    "nav.notifications": "Benachrichtigungen",
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "theme.system": "System"
  },
  zh: {
    "nav.overview": "概览",
    "nav.payments": "支付",
    "nav.wallets": "钱包",
    "nav.cards": "卡片",
    "nav.analytics": "分析",
    "nav.customers": "客户",
    "nav.profile": "个人资料",
    "nav.home": "首页",
    "nav.notifications": "通知",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "系统"
  },
  ja: {
    "nav.overview": "概要",
    "nav.payments": "支払い", 
    "nav.wallets": "ウォレット",
    "nav.cards": "カード",
    "nav.analytics": "分析",
    "nav.customers": "顧客",
    "nav.profile": "プロフィール",
    "nav.home": "ホーム",
    "nav.notifications": "通知", 
    "theme.light": "ライト",
    "theme.dark": "ダーク",
    "theme.system": "システム"
  },
  ar: {
    "nav.overview": "نظرة عامة",
    "nav.payments": "المدفوعات",
    "nav.wallets": "المحافظ",
    "nav.cards": "البطاقات",
    "nav.analytics": "التحليلات",
    "nav.customers": "العملاء",
    "nav.profile": "الملف الشخصي",
    "nav.home": "الرئيسية",
    "nav.notifications": "الإشعارات",
    "theme.light": "فاتح",
    "theme.dark": "داكن",
    "theme.system": "النظام"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}