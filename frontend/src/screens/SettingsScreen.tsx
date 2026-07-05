import { useState, useCallback, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import { useTranslation } from '../context/LanguageContext';
import { useSettings } from '../hooks/useSettings';
import { CURRENCIES, getCurrencyInfo } from '../data/currencies';
import { LANGUAGES, getLanguageInfo, PAYMENT_TIMEOUT_OPTIONS, SCREEN_TIMEOUT_OPTIONS } from '../data/languages';

const SettingsScreen = () => {
  const { state, dispatch } = usePOS();
  const { t, lang, setLang } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('veilpay_theme') || 'dark');
  const [editingShopName, setEditingShopName] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(false);
  const [shopNameDraft, setShopNameDraft] = useState(settings.shopName);
  const [receiptDraft, setReceiptDraft] = useState(settings.receiptFooter);
  const [showTimeoutPicker, setShowTimeoutPicker] = useState(false);
  const [showPaymentTimeoutPicker, setShowPaymentTimeoutPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('veilpay_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.filter = `brightness(${0.4 + (settings.brightness / 100) * 0.6})`;
    }
  }, [settings.brightness]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'GO_TO_SCREEN', screen: 'dashboard' });
  }, [dispatch]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const fn = window.toggleTheme;
    if (typeof fn === 'function') fn();
  }, []);

  const handleCurrencySelect = useCallback((code: string) => {
    dispatch({ type: 'SET_CURRENCY', currency: code });
    localStorage.setItem('veilpay_currency', code);
  }, [dispatch]);

  const handleLanguageSelect = useCallback((code: string) => {
    setLang(code);
    updateSetting('language', code);
    setShowLanguagePicker(false);
  }, [setLang, updateSetting]);

  const handleSaveShopName = useCallback(() => {
    updateSetting('shopName', shopNameDraft.trim() || 'VeilPay Store');
    setEditingShopName(false);
  }, [shopNameDraft, updateSetting]);

  const handleSaveReceipt = useCallback(() => {
    updateSetting('receiptFooter', receiptDraft.trim());
    setEditingReceipt(false);
  }, [receiptDraft, updateSetting]);

  const currentCurrency = getCurrencyInfo(state.selectedCurrency);
  const currentLanguage = getLanguageInfo(lang);

  const filteredCurrencies = CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="settings">
      <div className="settings-header">
        <button type="button" className="settings-back min-tap" aria-label={t('back_to_dashboard')} onClick={handleBack}>&#8592;</button>
        <h1 className="settings-title">{t('settings')}</h1>
      </div>

      <div className="settings-body">
        <div className="settings-section">
          <div className="settings-section-label">{t('appearance')}</div>
          <div className="settings-card-group">
            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('theme')}</span>
                <span className="settings-card-row-sub">{theme === 'dark' ? t('dark_mode') : t('light_ivory')}</span>
              </div>
              <div className="settings-theme-toggle">
                <button type="button" className={`settings-theme-btn ${theme === 'dark' ? 'settings-theme-btn--active' : ''} min-tap`} aria-label={t('dark_mode')} aria-pressed={theme === 'dark'} onClick={() => theme !== 'dark' && handleToggleTheme()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                </button>
                <button type="button" className={`settings-theme-btn ${theme === 'light' ? 'settings-theme-btn--active' : ''} min-tap`} aria-label={t('light_ivory')} aria-pressed={theme === 'light'} onClick={() => theme !== 'light' && handleToggleTheme()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                </button>
              </div>
            </div>

            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('screen_brightness')}</span>
                <span className="settings-card-row-sub">{settings.brightness}%</span>
              </div>
              <button type="button" className="settings-chevron-btn min-tap" aria-label={t('screen_brightness')} aria-expanded={showBrightnessSlider} onClick={() => setShowBrightnessSlider(s => !s)}>
                <span className="settings-chevron">{showBrightnessSlider ? '\u25B2' : '\u25BC'}</span>
              </button>
            </div>
            {showBrightnessSlider && (
              <div className="settings-slider-row">
                <div className="settings-brightness-display">
                  <span className="settings-brightness-icon" aria-hidden="true">{settings.brightness < 30 ? '\u{1F314}' : settings.brightness < 70 ? '\u{1F313}' : '\u2600'}</span>
                  <span className="settings-brightness-value">{settings.brightness}%</span>
                </div>
                <input type="range" min={20} max={100} step={5} value={settings.brightness} onChange={(e) => updateSetting('brightness', parseInt(e.target.value, 10))} className="settings-slider" aria-label={t('screen_brightness')} />
                <div className="settings-slider-labels"><span>20%</span><span>100%</span></div>
              </div>
            )}

            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('screen_timeout')}</span>
                <span className="settings-card-row-sub">{t('after_x_idle', { count: settings.screenTimeout, unit: settings.screenTimeout === 1 ? t('minute') : t('minutes') })}</span>
              </div>
              <button type="button" className="settings-chevron-btn min-tap" aria-label={t('screen_timeout')} aria-expanded={showTimeoutPicker} onClick={() => setShowTimeoutPicker(s => !s)}>
                <span className="settings-chevron">{showTimeoutPicker ? '\u25B2' : '\u25BC'}</span>
              </button>
            </div>
            {showTimeoutPicker && (
              <div className="settings-options-row">
                {SCREEN_TIMEOUT_OPTIONS.map(opt => (
                  <button key={opt} type="button" className={`settings-option-pill ${settings.screenTimeout === opt ? 'settings-option-pill--active' : ''} min-tap`} aria-pressed={settings.screenTimeout === opt} onClick={() => { updateSetting('screenTimeout', opt); setShowTimeoutPicker(false); }}>
                    {opt}m
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-label">{t('merchant_display')}</div>
          <div className="settings-card-group">
            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('shop_name')}</span>
                <span className="settings-card-row-sub">{settings.shopName}</span>
              </div>
              <button type="button" className="settings-chevron-btn min-tap" aria-label={t('shop_name')} onClick={() => { setShopNameDraft(settings.shopName); setEditingShopName(true); }}>
                <span className="settings-chevron">{'\u270E'}</span>
              </button>
            </div>
            {editingShopName && (
              <div className="settings-edit-row">
                <input type="text" className="settings-text-input min-tap" value={shopNameDraft} onChange={(e) => setShopNameDraft(e.target.value)} placeholder={t('shop_name_ph')} aria-label={t('shop_name')} maxLength={40} autoFocus />
                <div className="settings-edit-actions">
                  <button type="button" className="settings-edit-cancel min-tap" onClick={() => setEditingShopName(false)}>{t('cancel')}</button>
                  <button type="button" className="settings-edit-save min-tap" onClick={handleSaveShopName}>{t('save')}</button>
                </div>
              </div>
            )}

            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('receipt_footer')}</span>
                <span className="settings-card-row-sub">{settings.receiptFooter || '\u2014'}</span>
              </div>
              <button type="button" className="settings-chevron-btn min-tap" aria-label={t('receipt_footer')} onClick={() => { setReceiptDraft(settings.receiptFooter); setEditingReceipt(true); }}>
                <span className="settings-chevron">{'\u270E'}</span>
              </button>
            </div>
            {editingReceipt && (
              <div className="settings-edit-row">
                <input type="text" className="settings-text-input min-tap" value={receiptDraft} onChange={(e) => setReceiptDraft(e.target.value)} placeholder={t('receipt_footer_ph')} aria-label={t('receipt_footer')} maxLength={80} autoFocus />
                <div className="settings-edit-actions">
                  <button type="button" className="settings-edit-cancel min-tap" onClick={() => setEditingReceipt(false)}>{t('cancel')}</button>
                  <button type="button" className="settings-edit-save min-tap" onClick={handleSaveReceipt}>{t('save')}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-label">{t('payment_section')}</div>
          <div className="settings-card-group">
            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('payment_timeout')}</span>
                <span className="settings-card-row-sub">{settings.paymentTimeout} {settings.paymentTimeout === 1 ? t('minute') : t('minutes')}</span>
              </div>
              <button type="button" className="settings-chevron-btn min-tap" aria-label={t('payment_timeout')} aria-expanded={showPaymentTimeoutPicker} onClick={() => setShowPaymentTimeoutPicker(s => !s)}>
                <span className="settings-chevron">{showPaymentTimeoutPicker ? '\u25B2' : '\u25BC'}</span>
              </button>
            </div>
            {showPaymentTimeoutPicker && (
              <div className="settings-options-row">
                {PAYMENT_TIMEOUT_OPTIONS.map(opt => (
                  <button key={opt} type="button" className={`settings-option-pill ${settings.paymentTimeout === opt ? 'settings-option-pill--active' : ''} min-tap`} aria-pressed={settings.paymentTimeout === opt} onClick={() => { updateSetting('paymentTimeout', opt); setShowPaymentTimeoutPicker(false); }}>
                    {opt}m
                  </button>
                ))}
              </div>
            )}

            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('confirmation_sound')}</span>
                <span className="settings-card-row-sub">{t('beep_on_success')}</span>
              </div>
              <button type="button" role="switch" aria-checked={settings.soundEnabled} aria-label={t('confirmation_sound')} className={`settings-toggle ${settings.soundEnabled ? 'settings-toggle--on' : ''}`} onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}>
                <span className="settings-toggle-knob" />
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-label">{t('region')}</div>
          <div className="settings-card-group">
            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('local_currency')}</span>
                <span className="settings-card-row-sub">{currentCurrency.flag} {currentCurrency.code} · {currentCurrency.name}</span>
              </div>
              <span className="settings-chevron">{'\u203A'}</span>
            </div>

            <div className="settings-card-row">
              <div className="settings-card-row-text">
                <span className="settings-card-row-title">{t('language')}</span>
                <span className="settings-card-row-sub">{currentLanguage.flag} {currentLanguage.nativeName}</span>
              </div>
              <button type="button" className="settings-chevron-btn min-tap" aria-label={t('language')} onClick={() => setShowLanguagePicker(s => !s)}>
                <span className="settings-chevron">{showLanguagePicker ? '\u25B2' : '\u25BC'}</span>
              </button>
            </div>
            {showLanguagePicker && (
              <div className="settings-lang-grid">
                {LANGUAGES.map(l => {
                  const sel = lang === l.code;
                  return (
                    <button key={l.code} type="button" className={`settings-lang-pill ${sel ? 'settings-lang-pill--active' : ''} min-tap`} aria-pressed={sel} onClick={() => handleLanguageSelect(l.code)}>
                      <span className="settings-lang-flag">{l.flag}</span>
                      <span className="settings-lang-name">{l.nativeName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-label">{t('currency_selection')}</div>
          <div className="settings-current-currency">
            <span className="settings-current-flag">{currentCurrency.flag}</span>
            <span className="settings-current-code">{currentCurrency.code}</span>
            <span className="settings-current-name">{currentCurrency.name} · {currentCurrency.country}</span>
          </div>
          <input type="text" className="settings-search min-tap" placeholder={t('search_currency')} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={t('search_currency')} />
          <div className="settings-currency-list" role="listbox" aria-label={t('local_currency')}>
            {filteredCurrencies.map(c => {
              const sel = state.selectedCurrency === c.code;
              return (
                <button type="button" key={c.code} className={`settings-currency-row ${sel ? 'settings-currency-row--selected' : ''} min-tap`} role="option" aria-selected={sel} aria-label={`${c.name}, ${c.country}`} onClick={() => handleCurrencySelect(c.code)}>
                  <span className="settings-currency-flag">{c.flag}</span>
                  <span className="settings-currency-info"><span className="settings-currency-code">{c.code}</span><span className="settings-currency-name">{c.name} · {c.country}</span></span>
                  <span className="settings-currency-symbol">{c.symbol}</span>
                  {sel && <span className="settings-currency-check" aria-hidden="true">{'\u2713'}</span>}
                </button>
              );
            })}
            {filteredCurrencies.length === 0 && <div className="settings-currency-empty">{t('no_currencies')}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
