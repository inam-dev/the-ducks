import { useOutletContext } from "react-router";
import { mockArchiveDocuments } from "../data/mockArchiveDocuments";
import type { AppOutletContext } from "../types/app";

export function meta() {
  return [
    { title: "CouncilPoint - Secure Archive" },
    { name: "description", content: "Secure document archive" },
  ];
}

export default function ArchivePage() {
  const { user, t } = useOutletContext<AppOutletContext>();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">{t("secureArchive")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t("archiveDescription")}
        </p>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
              <tr>
                <th className="px-5 py-4">Filename</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">GDPR Score</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Uploaded At</th>
                <th className="px-5 py-4">DBS Access Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockArchiveDocuments.map((doc) => {
                const locked = user.accessLevel < doc.accessLevelRequired;
                return (
                  <tr key={doc.id} className={locked ? "bg-slate-50 text-slate-400 dark:bg-slate-950/40" : ""}>
                    <td className="px-5 py-4 font-bold">
                      <span className="mr-2">{locked ? t("locked") : t("open")}</span>
                      {doc.filename}
                    </td>
                    <td className="px-5 py-4">{doc.source}</td>
                    <td className="px-5 py-4">{doc.documentType}</td>
                    <td className="px-5 py-4">{doc.department}</td>
                    <td className="px-5 py-4">{locked ? "--" : `${doc.gdprScore}%`}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(doc.status)}`}>{locked ? t("locked") : doc.status}</span>
                    </td>
                    <td className="px-5 py-4">{doc.uploadedAt}</td>
                    <td className="px-5 py-4">{doc.dbsAccessRequired}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm font-semibold text-blue-950">
        Safeguarding documents restricted. Child and vulnerable person data protected. Redacted share-safe export only for lower access users.
      </section>
    </div>
  );
}

function statusStyle(status: string) {
  if (status === "Processed") {
    return "bg-teal-100 text-teal-800";
  }
  if (status === "Needs Review") {
    return "bg-yellow-100 text-yellow-900";
  }
  return "bg-red-100 text-red-800";
}
