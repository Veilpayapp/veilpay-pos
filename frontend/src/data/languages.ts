export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English',           nativeName: 'English',       flag: '🇬🇧' },
  { code: 'es', name: 'Spanish',           nativeName: 'Español',       flag: '🇪🇸' },
  { code: 'fr', name: 'French',            nativeName: 'Français',      flag: '🇫🇷' },
  { code: 'de', name: 'German',            nativeName: 'Deutsch',       flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese',        nativeName: 'Português',    flag: '🇵🇹' },
  { code: 'it', name: 'Italian',           nativeName: 'Italiano',      flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch',             nativeName: 'Nederlands',    flag: '🇳🇱' },
  { code: 'ru', name: 'Russian',           nativeName: 'Русский',       flag: '🇷🇺' },
  { code: 'pl', name: 'Polish',            nativeName: 'Polski',        flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish',           nativeName: 'Türkçe',        flag: '🇹🇷' },
  { code: 'ar', name: 'Arabic',            nativeName: 'العربية',        flag: '🇸🇦' },
  { code: 'he', name: 'Hebrew',            nativeName: 'עברית',          flag: '🇮🇱' },
  { code: 'fa', name: 'Persian',           nativeName: 'فارسی',          flag: '🇮🇷' },
  { code: 'ur', name: 'Urdu',              nativeName: 'اردو',           flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi',             nativeName: 'हिन्दी',           flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali',           nativeName: 'বাংলা',           flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil',             nativeName: 'தமிழ்',           flag: '🇮🇳' },
  { code: 'te', name: 'Telugu',            nativeName: 'తెలుగు',          flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi',           nativeName: 'मराठी',           flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese',           nativeName: '中文',            flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese',          nativeName: '日本語',           flag: '🇯🇵' },
  { code: 'ko', name: 'Korean',            nativeName: '한국어',           flag: '🇰🇷' },
  { code: 'th', name: 'Thai',              nativeName: 'ไทย',             flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese',        nativeName: 'Tiếng Việt',    flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian',        nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay',             nativeName: 'Bahasa Melayu',  flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino',          nativeName: 'Filipino',       flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili',            nativeName: 'Kiswahili',     flag: '🇰🇪' },
  { code: 'am', name: 'Amharic',           nativeName: 'አማርኛ',            flag: '🇪🇹' },
  { code: 'ha', name: 'Hausa',             nativeName: 'Hausa',          flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba',            nativeName: 'Yorùbá',        flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo',              nativeName: 'Igbo',          flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu',              nativeName: 'isiZulu',       flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans',         nativeName: 'Afrikaans',     flag: '🇿🇦' },
  { code: 'uk', name: 'Ukrainian',         nativeName: 'Українська',     flag: '🇺🇦' },
  { code: 'cs', name: 'Czech',             nativeName: 'Čeština',       flag: '🇨🇿' },
  { code: 'el', name: 'Greek',             nativeName: 'Ελληνικά',        flag: '🇬🇷' },
  { code: 'sv', name: 'Swedish',           nativeName: 'Svenska',       flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian',         nativeName: 'Norsk',         flag: '🇳🇴' },
  { code: 'da', name: 'Danish',            nativeName: 'Dansk',         flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish',           nativeName: 'Suomi',         flag: '🇫🇮' },
  { code: 'ro', name: 'Romanian',          nativeName: 'Română',        flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian',         nativeName: 'Magyar',        flag: '🇭🇺' },
];

export const getLanguageInfo = (code: string): LanguageInfo => {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
};

export const PAYMENT_TIMEOUT_OPTIONS = [1, 2, 5];
export const SCREEN_TIMEOUT_OPTIONS = [1, 2, 5, 10, 30];
