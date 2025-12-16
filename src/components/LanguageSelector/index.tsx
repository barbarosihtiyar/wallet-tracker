import "./language-selector.scss";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import { Icons } from "@/shared/constants";
import {
  setupLanguageDirection,
  type SupportedLanguage,
  supportedLanguages,
} from "@/shared/i18n";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current =
    (Object.keys(supportedLanguages) as SupportedLanguage[]).find(
      (c) => c === (i18n.language as SupportedLanguage),
    ) ?? (Object.keys(supportedLanguages)[0] as SupportedLanguage);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const changeLang = (code: SupportedLanguage) => {
    if (code !== i18n.language) {
      i18n.changeLanguage(code);
      setupLanguageDirection(code);
    }
    setOpen(false);
  };

  return (
    <div className="language" ref={rootRef}>
      <button
        className="language__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon width={14} height={14} name={Icons.LANGUAGE} />
        <span className="language__label">{supportedLanguages[current]}</span>
        <Icon name={open ? Icons.ARROW_UP : Icons.ARROW_DOWN} />
      </button>

      {open && (
        <ul className="language__menu" role="listbox">
          {Object.entries(supportedLanguages).map(([code, name]) => {
            const active = i18n.language === code;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`language__item ${active ? "is-active" : ""}`}
                  onClick={() => changeLang(code as SupportedLanguage)}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
