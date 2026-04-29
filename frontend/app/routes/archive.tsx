import { useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const filteredDocuments = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return mockArchiveDocuments;
    }

    return mockArchiveDocuments.filter((doc) =>
      [doc.filename, doc.source, doc.documentType, doc.department, doc.status, doc.uploadedAt, doc.dbsAccessRequired, demoSearchAliases(doc.id)]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">{t("secureArchive")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t("archiveDescription")}
        </p>
      </header>

      <section className="panel-card p-4">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          Search archive
          <input
            className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm shadow-sm hover:border-teal-200 dark:border-slate-700 dark:bg-slate-950"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search filename, type, department, status..."
          />
        </label>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Showing {filteredDocuments.length} of {mockArchiveDocuments.length} demo documents
        </p>
      </section>

      <section className="panel-card overflow-hidden">
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
              {filteredDocuments.map((doc) => {
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
              {filteredDocuments.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center font-semibold text-slate-500 dark:text-slate-400" colSpan={8}>
                    No demo documents match your search.
                  </td>
                </tr>
              )}
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

function demoSearchAliases(id: string) {
  return id === "doc-001" ? "John Doe UB8 3PH hayes road" : "";
}
