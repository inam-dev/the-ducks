import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { getCurrentUser, logout } from "../api/authApi";
import { getLanguageOption, getStoredLanguage, languageOptions, languageStorageKey, translate, type LanguageCode, type TranslationKey } from "../i18n";
import type { User } from "../types/auth";
import AccessibilityToolbar from "./AccessibilityToolbar";
import { DbsAccessBadge } from "./DbsAccessBadge";

const navItems = [
  { to: "/", labelKey: "dashboard" },
  { to: "/upload", labelKey: "upload" },
  { to: "/processing", labelKey: "processing" },
  { to: "/results", labelKey: "results" },
  { to: "/archive", labelKey: "archive" },
];

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [language, setLanguageState] = useState<LanguageCode>(() => getStoredLanguage());
  const t = (key: TranslationKey) => translate(language, key);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  useEffect(() => {
    const option = getLanguageOption(language);
    document.documentElement.lang = option.htmlLang;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
      </div>
    );
  }

  return (
    <div className="app-shell-bg min-h-screen text-slate-900 dark:text-slate-100">
      {showAccessibility && <AccessibilityToolbar onClose={() => setShowAccessibility(false)} />}
      <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85 dark:shadow-black/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-lg font-black text-slate-950 shadow-lg shadow-yellow-300/40 ring-1 ring-yellow-200">
              CP
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">CouncilPoint</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("appTagline")}</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-slate-600 dark:text-slate-300">{t("language")}</span>
              <select
                className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm shadow-sm hover:border-teal-200 dark:border-slate-700 dark:bg-slate-900"
                value={language}
                onChange={(event) => setLanguage(event.target.value as LanguageCode)}
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <DbsAccessBadge user={user} />
            <button
              className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:border-teal-200 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={() => setShowAccessibility((value) => !value)}
            >
              {t("accessibility")}
            </button>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300/40 hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:shadow-black/30"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              {t("signOut")}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="panel-card sticky top-24 self-start p-3">
          <label className="mb-3 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm font-semibold dark:bg-slate-800 md:hidden">
            <span>{t("language")}</span>
            <select
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={language}
              onChange={(event) => setLanguage(event.target.value as LanguageCode)}
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-200/60 dark:shadow-teal-950/50"
                      : "text-slate-600 hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-200"
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/90 p-3 text-xs font-semibold text-teal-900 shadow-sm dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-100">
            {t("currentLanguageApplies")}
          </div>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/90 p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-800/80">
            <p className="font-semibold">{user.name}</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{user.role}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{user.department}</p>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet context={{ user, language, setLanguage, t }} />
        </main>
      </div>
    </div>
  );
}
