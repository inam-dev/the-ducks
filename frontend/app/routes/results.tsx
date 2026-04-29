import { useState } from "react";
import type { ReactNode } from "react";
import { useOutletContext } from "react-router";
import { getLatestDocumentResult, translateDocument } from "../api/documentsApi";
import { calculateShareSafeScore, mockDocumentResult } from "../data/mockDocumentResult";
import { languageOptions } from "../i18n";
import type { AppOutletContext } from "../types/app";
import type { User } from "../types/auth";
import type { SensitiveItem } from "../types/document";

export function meta() {
  return [
    { title: "CouncilPoint - Results" },
    { name: "description", content: "Processed document results" },
  ];
}

export default function ResultsPage() {
  const { user, t } = useOutletContext<AppOutletContext>();
  const documentResult = getLatestDocumentResult() ?? mockDocumentResult;
  const [view, setView] = useState<"redacted" | "original">("redacted");
  const [targetLanguage, setTargetLanguage] = useState("Polish");
  const [translatedText, setTranslatedText] = useState(documentResult.translatedText);

  const canViewOriginal = user.accessLevel >= 3 && user.canViewOriginalSensitiveData;
  const score = calculateShareSafeScore(documentResult.sensitiveItems, true);

  const requestTranslation = async () => {
    const response = await translateDocument(documentResult.id, targetLanguage);
    setTranslatedText(response.translatedText);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">{t("documentResults")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t("dbsVisibilityMessage")}
        </p>
      </header>

      <DbsAccessNotice user={user} canViewOriginal={canViewOriginal} />

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel title={t("documentSummary")}>
            <dl className="grid gap-4 md:grid-cols-3">
              {[
                ["Filename", documentResult.filename],
                ["Source", documentResult.source],
                ["Document type", documentResult.documentType],
                ["Document condition", documentResult.documentCondition],
                ["Language", documentResult.language],
                ["Historic document", documentResult.historicDocument ? "Yes" : "No"],
                ["Handwriting detected", documentResult.handwritingDetected ? "Yes" : "No"],
                ["OCR confidence", `${documentResult.ocrConfidence}%`],
                ["Handwriting confidence", documentResult.handwritingConfidence ? `${documentResult.handwritingConfidence}%` : "Not detected"],
                ["Reference ID", documentResult.referenceId],
                ["Urgency", documentResult.urgency],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <dt className="text-xs font-bold uppercase text-slate-500">{label}</dt>
                  <dd className="mt-2 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title={t("aiSummary")}>
              <p className="leading-relaxed text-slate-700 dark:text-slate-200">{documentResult.aiSummary}</p>
            </Panel>
            <Panel title={t("residentSummary")}>
              <p className="leading-relaxed text-slate-700 dark:text-slate-200">{documentResult.residentFriendlySummary}</p>
            </Panel>
          </div>

          <Panel title={t("extractedData")}>
            <div className="grid gap-3 md:grid-cols-2">
              {documentResult.extractedFields.map((field) => (
                <div key={field.label} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase text-slate-500">{field.label}</p>
                  <p className="mt-2 font-semibold">{maskField(field.label, field.value, user)}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title={t("sensitiveInfo")}>
            {user.accessLevel <= 2 && (
              <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-sm font-semibold text-yellow-900">
                Protected safeguarding-related information detected.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
                    <th className="py-3">Type</th>
                    <th className="py-3">Value</th>
                    <th className="py-3">Risk level</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {documentResult.sensitiveItems
                    .filter((item) => canShowSensitiveRow(item, user))
                    .map((item) => (
                      <tr key={item.type}>
                        <td className="py-3 font-semibold">{item.type}</td>
                        <td className="py-3">{maskSensitiveValue(item, user)}</td>
                        <td className="py-3">
                          <RiskBadge risk={item.riskLevel} />
                        </td>
                        <td className="py-3">{item.action}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title={t("redactionPreview")}>
            {!canViewOriginal && (
              <div className="mb-4 rounded-lg bg-slate-100 p-4 text-sm font-semibold dark:bg-slate-800">
                {t("originalHidden")}
              </div>
            )}
            {canViewOriginal && (
              <div className="mb-4 flex gap-2">
                <button className={tabClass(view === "original")} onClick={() => setView("original")}>{t("originalView")}</button>
                <button className={tabClass(view === "redacted")} onClick={() => setView("redacted")}>{t("redactedView")}</button>
              </div>
            )}
            <div className="rounded-xl bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100">
              {canViewOriginal && view === "original" ? documentResult.originalText : documentResult.redactedText}
            </div>
          </Panel>

          {user.canViewAuditLogs ? (
            <Panel title={t("auditTrail")}>
              <ul className="space-y-3">
                {documentResult.auditTrail.map((entry) => (
                  <li key={entry} className="rounded-lg bg-slate-50 p-3 text-sm font-medium dark:bg-slate-800">{entry}</li>
                ))}
              </ul>
            </Panel>
          ) : (
            <Panel title={t("auditTrail")}>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t("auditHidden")}</p>
            </Panel>
          )}
        </div>

        <aside className="space-y-6">
          <Panel title={t("shareSafeScore")}>
            <div className="text-center">
              <p className="text-6xl font-black text-teal-600">{score}%</p>
              <p className="mt-2 font-bold">{documentResult.gdprStatus}</p>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${score}%` }} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-red-50 p-3 text-red-900">
                <dt className="font-bold">Risk before</dt>
                <dd>{documentResult.riskBeforeRedaction}</dd>
              </div>
              <div className="rounded-lg bg-teal-50 p-3 text-teal-900">
                <dt className="font-bold">Risk after</dt>
                <dd>{documentResult.riskAfterRedaction}</dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-2 text-sm">
              {documentResult.gdprWarnings.map((warning) => (
                <li key={warning} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">{warning}</li>
              ))}
            </ul>
          </Panel>

          <Panel title={t("autoRouting")}>
            <p className="text-sm text-slate-500">{t("suggestedDepartment")}</p>
            <p className="text-xl font-black">{documentResult.suggestedDepartment}</p>
            <p className="mt-4 text-sm font-bold">{t("confidence")}: {documentResult.routingConfidence}%</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{documentResult.routingReason}</p>
            <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm font-semibold text-yellow-950">
              {documentResult.suggestedNextAction}
            </div>
          </Panel>

          <Panel title={t("translationPanel")}>
            <p className="text-sm text-slate-500">{t("detectedLanguage")}: {documentResult.language}</p>
            <select className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)}>
              {languageOptions.map((language) => (
                <option key={language.code}>{language.label}</option>
              ))}
            </select>
            <button className="mt-3 w-full rounded-lg bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700" onClick={requestTranslation}>
              {t("requestTranslation")}
            </button>
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">{translatedText}</p>
          </Panel>

          <Panel title={t("smartAssistant")}>
            <div className="space-y-3 text-sm">
              <p><strong>GDPR:</strong> {score}% share-safe after redaction.</p>
              <p><strong>Routing:</strong> Send to {documentResult.suggestedDepartment}.</p>
              <p><strong>Next action:</strong> {documentResult.suggestedNextAction}</p>
              <p><strong>Resident summary:</strong> {documentResult.residentFriendlySummary}</p>
              <p className="rounded-lg bg-blue-50 p-3 font-semibold text-blue-950">{documentResult.staffNoteSuggestion}</p>
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function DbsAccessNotice({ user, canViewOriginal }: { user: User; canViewOriginal: boolean }) {
  return (
    <section className="panel-card p-5">
      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["Logged-in user", user.name],
          ["Role", user.role],
          ["Department", user.department],
          ["DBS access level", `${user.accessLabel} (${user.dbsLevel})`],
          ["Sensitive data visibility", canViewOriginal ? "Enabled" : "Restricted"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>
      {user.accessLevel <= 2 && (
        <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm font-semibold text-yellow-950">
          Some sensitive information is hidden because of your DBS access level.
        </p>
      )}
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel-card p-5">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      {children}
    </section>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles = risk === "High" ? "bg-red-100 text-red-800" : risk === "Medium" ? "bg-yellow-100 text-yellow-900" : "bg-teal-100 text-teal-800";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles}`}>{risk}</span>;
}

function canShowSensitiveRow(item: SensitiveItem, user: User) {
  if (item.type === "Child Mentioned" || item.type === "Medical Info") {
    return user.accessLevel >= 3 && user.canViewChildOrVulnerableInfo;
  }
  return true;
}

function maskSensitiveValue(item: SensitiveItem, user: User) {
  if (item.type === "Reference ID" && item.value.toLowerCase().includes("dob")) {
    return "[REDACTED DOB]";
  }
  if (user.accessLevel <= 2) {
    return "[REDACTED - DBS access required]";
  }
  if ((item.type === "Child Mentioned" || item.type === "Medical Info") && !user.canViewChildOrVulnerableInfo) {
    return "[REDACTED - DBS access required]";
  }
  return item.value;
}

function maskField(label: string, value: string, user: User) {
  if (label.toLowerCase() === "dob") {
    return "[REDACTED DOB]";
  }
  const protectedLabels = ["Resident", "Address", "Health Risk Mentioned"];
  if (user.accessLevel <= 2 && protectedLabels.includes(label)) {
    return "[REDACTED - DBS access required]";
  }
  return value;
}

function tabClass(active: boolean) {
  return `rounded-lg px-4 py-2 text-sm font-bold ${active ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"}`;
}
