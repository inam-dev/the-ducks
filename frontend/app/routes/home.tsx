import { Link, useOutletContext } from "react-router";
import { DbsAccessBadge } from "../components/DbsAccessBadge";
import { mockArchiveDocuments } from "../data/mockArchiveDocuments";
import type { AppOutletContext } from "../types/app";

export function meta() {
  return [
    { title: "CouncilPoint - Dashboard" },
    { name: "description", content: "CouncilPoint dashboard" },
  ];
}

export default function Dashboard() {
  const { user, t } = useOutletContext<AppOutletContext>();

  const stats = [
    [t("documentsProcessed"), "1,284"],
    [t("historicRecordsDigitised"), "342"],
    [t("sensitiveItemsRedacted"), "4,876"],
    [t("translationsCompleted"), "219"],
    [t("averageTimeSaved"), "12 mins/document"],
  ];

  const securityItems = [
    "Encryption active",
    "DBS-based access control enabled",
    "Role permissions active",
    "Audit logging enabled",
    "Local AI-ready",
    "Data leaves council network: No",
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <DbsAccessBadge user={user} />
            <h1 className="mt-5 text-3xl font-black">{t("welcome")}, {user.name}</h1>
            <p className="mt-2 text-slate-300">
              {user.role} in {user.department}. {t("roleVisibility")}
            </p>
          </div>
          <Link className="rounded-xl bg-yellow-400 px-5 py-3 text-center font-black text-slate-950 hover:bg-yellow-300" to="/upload">
            {t("uploadNewDocument")}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">{t("securityStatus")}</h2>
          <div className="mt-5 grid gap-3">
            {securityItems.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <span className="text-sm font-medium">{item}</span>
                <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-800">{t("active")}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t("recentDocuments")}</h2>
            <Link className="text-sm font-bold text-teal-700 hover:text-teal-800" to="/archive">
              {t("viewArchive")}
            </Link>
          </div>
          <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
            {mockArchiveDocuments.concat([
              {
                id: "doc-005",
                filename: "Noise Complaint.pdf",
                source: "Resident",
                documentType: "Noise Complaint",
                department: "Environmental Health",
                gdprScore: 90,
                status: "Processed" as const,
                uploadedAt: "Last week",
                dbsAccessRequired: "Standard DBS+",
                accessLevelRequired: 2,
              },
            ]).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold">{doc.filename}</p>
                  <p className="mt-1 text-sm text-slate-500">{doc.source} - {doc.department}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{doc.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
