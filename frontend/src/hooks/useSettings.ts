import { useState, useCallback, useEffect } from 'react';

export interface MerchantSettings {
  shopName: string;
  receiptFooter: string;
  brightness: number;
  screenTimeout: number;
  soundEnabled: boolean;
  language: string;
  paymentTimeout: number;
}

const STORAGE_KEY = 'veilpay_settings';

const DEFAULT_SETTINGS: MerchantSettings = {
  shopName: 'VeilPay Store',
  receiptFooter: 'Thank you for shopping!',
  brightness: 80,
  screenTimeout: 2,
  soundEnabled: true,
  language: 'en',
  paymentTimeout: 3,
};

const loadSettings = (): MerchantSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<MerchantSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings: MerchantSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<MerchantSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof MerchantSettings>(
    key: K,
    value: MerchantSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateMultiple = useCallback((updates: Partial<MerchantSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, updateSetting, updateMultiple, reset };
};

export const playBeep = (enabled: boolean): void => {
  if (!enabled) return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    osc.onended = () => ctx.close();
  } catch {
    // AudioContext not available
  }
};
