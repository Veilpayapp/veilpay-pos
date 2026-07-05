export interface CurrencyInfo {
  code: string;
  name: string;
  country: string;
  flag: string;
  symbol: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar',          country: 'United States',   flag: '🇺🇸', symbol: '$' },
  { code: 'NGN', name: 'Nigerian Naira',     country: 'Nigeria',          flag: '🇳🇬', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling',    country: 'Kenya',            flag: '🇰🇪', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi',      country: 'Ghana',            flag: '🇬🇭', symbol: '₵' },
  { code: 'ZAR', name: 'South African Rand',  country: 'South Africa',     flag: '🇿🇦', symbol: 'R' },
  { code: 'EGP', name: 'Egyptian Pound',     country: 'Egypt',            flag: '🇪🇬', symbol: 'E£' },
  { code: 'INR', name: 'Indian Rupee',       country: 'India',            flag: '🇮🇳', symbol: '₹' },
  { code: 'PKR', name: 'Pakistani Rupee',    country: 'Pakistan',         flag: '🇵🇰', symbol: '₨' },
  { code: 'BDT', name: 'Bangladeshi Taka',   country: 'Bangladesh',       flag: '🇧🇩', symbol: '৳' },
  { code: 'IDR', name: 'Indonesian Rupiah',  country: 'Indonesia',        flag: '🇮🇩', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso',   country: 'Philippines',      flag: '🇵🇭', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong',    country: 'Vietnam',          flag: '🇻🇳', symbol: '₫' },
  { code: 'THB', name: 'Thai Baht',          country: 'Thailand',         flag: '🇹🇭', symbol: '฿' },
  { code: 'TRY', name: 'Turkish Lira',       country: 'Turkey',           flag: '🇹🇷', symbol: '₺' },
  { code: 'BRL', name: 'Brazilian Real',     country: 'Brazil',           flag: '🇧🇷', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso',      country: 'Mexico',           flag: '🇲🇽', symbol: '$' },
  { code: 'ARS', name: 'Argentine Peso',    country: 'Argentina',        flag: '🇦🇷', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso',    country: 'Colombia',         flag: '🇨🇴', symbol: '$' },
  { code: 'EUR', name: 'Euro',               country: 'European Union',  flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound',      country: 'United Kingdom',   flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen',       country: 'Japan',            flag: '🇯🇵', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan',      country: 'China',            flag: '🇨🇳', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham',         country: 'United Arab Emirates', flag: '🇦🇪', symbol: 'AED' },
  { code: 'SAR', name: 'Saudi Riyal',        country: 'Saudi Arabia',     flag: '🇸🇦', symbol: '﷼' },
];

export const getCurrencyInfo = (code: string): CurrencyInfo => {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
};

export const EXCHANGE_RATE_REFRESH_MS = 60000;
