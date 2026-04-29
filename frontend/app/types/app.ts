import type { User } from "./auth";
import type { LanguageCode, TranslationKey } from "../i18n";

export type AppOutletContext = {
  user: User;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};
