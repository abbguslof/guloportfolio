// src/scripts/i18n-client.ts - Client-side reactive language manager
import { translations, type Lang, type TranslationKey } from '../data/i18n';

export function getSiteLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('site_lang') as Lang) || 'en';
}

export function setSiteLang(lang: Lang): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  applySiteLang(lang);
  window.dispatchEvent(new CustomEvent('lang-change', { detail: { lang } }));
}

export function applySiteLang(lang: Lang): void {
  if (typeof document === 'undefined') return;

  const dict = translations[lang];

  // 1. Update text nodes with data-i18n
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as TranslationKey;
    if (key && dict[key] !== undefined) {
      // If there are replacement tokens like {count}
      const count = el.getAttribute('data-i18n-count');
      let text: string = dict[key];
      if (count !== null) {
        text = text.replace('{count}', count);
      }
      el.innerHTML = text;
    }
  });

  // 2. Update placeholders with data-i18n-placeholder
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder') as TranslationKey;
    if (key && dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // 3. Update title attributes with data-i18n-title
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title') as TranslationKey;
    if (key && dict[key]) {
      el.title = dict[key];
    }
  });

  // 4. Update Header Toggle Buttons visual active state
  const btnEn = document.getElementById('btn-lang-en');
  const btnSv = document.getElementById('btn-lang-sv');

  if (btnEn && btnSv) {
    if (lang === 'en') {
      btnEn.className = 'lang-btn px-1.5 sm:px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer text-[#10b981] bg-[#0d1117] border border-[#10b981]/40 shadow-sm';
      btnSv.className = 'lang-btn px-1.5 sm:px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1f242c]/60';
    } else {
      btnSv.className = 'lang-btn px-1.5 sm:px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer text-[#10b981] bg-[#0d1117] border border-[#10b981]/40 shadow-sm';
      btnEn.className = 'lang-btn px-1.5 sm:px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1f242c]/60';
    }
  }

  // 5. Update document title and meta description
  const titleEl = document.querySelector('title');
  if (titleEl) {
    const localizedTitle = titleEl.getAttribute(`data-title-${lang}`);
    if (localizedTitle) {
      document.title = localizedTitle;
    }
  }
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) {
    const localizedDesc = descEl.getAttribute(`data-desc-${lang}`);
    if (localizedDesc) {
      descEl.setAttribute('content', localizedDesc);
    }
  }
}

// Auto-run on script load if in browser
if (typeof window !== 'undefined') {
  const current = getSiteLang();
  document.documentElement.lang = current;
  document.documentElement.setAttribute('data-lang', current);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applySiteLang(current));
  } else {
    applySiteLang(current);
  }

  document.addEventListener('astro:page-load', () => {
    applySiteLang(getSiteLang());
  });
}

