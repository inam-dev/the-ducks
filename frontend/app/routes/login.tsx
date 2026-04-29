import { useState } from "react";
import { useNavigate } from "react-router";
import { loginWithCredentials, loginWithDemoUser } from "../api/authApi";
import { mockUsers } from "../data/mockUsers";
import { DbsAccessBadge } from "../components/DbsAccessBadge";
import { Logo } from "../components/Logo";
import { getLanguageOption, getStoredLanguage, languageOptions, languageStorageKey, translate, type LanguageCode } from "../i18n";
import { useEffect } from "react";

export function meta() {
  return [
    { title: "CouncilPoint - Login" },
    { name: "description", content: "Secure council staff login" },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("priya.patel@hillingdon.gov.uk");
  const [password, setPassword] = useState("demo-password");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>(() => getStoredLanguage());
  const t = (key: string) => translate(language, key);

  useEffect(() => {
    const option = getLanguageOption(language);
    document.documentElement.lang = option.htmlLang;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const signIn = async (userId?: string) => {
    setLoadingUserId(userId ?? "credentials");
    const user = userId
      ? await loginWithDemoUser(userId)
      : await loginWithCredentials(email, password);

    if (user) {
      navigate("/");
    }
    setLoadingUserId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="mb-6 flex items-center justify-start">
            <Logo size="lg" />
          </div>
          <h1 className="text-5xl font-black tracking-tight">CouncilPoint</h1>
          <p className="mt-4 max-w-xl text-xl text-slate-300">
            {t("appTagline")} for local councils.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            {[
              "Encrypted document processing",
              "DBS-based access control enabled",
              "Audit logging enabled",
              "Data does not leave council environment",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
          <div className="mb-5 flex justify-end">
            <label className="flex items-center gap-2 text-sm font-semibold">
              {t("language")}
              <select
                className="rounded-lg border border-slate-300 bg-white px-3 py-2"
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
          </div>
          <h2 className="text-2xl font-bold">Council staff login</h2>
          <p className="mt-1 text-sm text-slate-600">Use demo accounts to show DBS-based permissions.</p>

          <div className="mt-6 grid gap-4">
            <label className="text-sm font-semibold">
              Email
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
              />
            </label>
            <label className="text-sm font-semibold">
              Password
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
              />
            </label>
            <button
              className="rounded-lg bg-teal-600 px-4 py-3 font-bold text-white hover:bg-teal-700"
              onClick={() => signIn()}
              disabled={loadingUserId !== null}
            >
              Sign in
            </button>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-bold text-slate-700">Demo DBS access levels</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50"
                  onClick={() => signIn(user.id)}
                  disabled={loadingUserId !== null}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{user.role}</p>
                    </div>
                    <DbsAccessBadge user={user} compact />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{user.department}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
