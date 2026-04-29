import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { uploadDocument } from "../api/documentsApi";
import type { AppOutletContext } from "../types/app";

export function meta() {
  return [
    { title: "CouncilPoint - Upload" },
    { name: "description", content: "Upload council documents" },
  ];
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { t } = useOutletContext<AppOutletContext>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("Resident");
  const [documentType, setDocumentType] = useState("Auto-detect");
  const [condition, setCondition] = useState("Scanned document");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "Extract key data",
    "Detect sensitive information",
    "Redact GDPR-sensitive data",
    "Generate summary",
    "Auto-route to department",
    "Run local AI analysis",
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const toggleOption = (option: string) => {
    setSelectedOptions((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  const processDocument = async () => {
    setIsUploading(true);
    if (file) {
      await uploadDocument(file);
    }
    navigate("/processing");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">{t("uploadDocument")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t("uploadDescription")}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel-card p-6">
          <button
            className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-slate-50/80 p-8 text-center shadow-inner transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-teal-700 dark:hover:bg-teal-950/30"
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-5xl font-black text-yellow-500">CP</span>
            <span className="mt-4 text-lg font-bold">{t("uploadBox")}</span>
            <span className="mt-1 text-sm text-slate-500">{t("chooseFile")}</span>
            {file && <span className="mt-4 rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-800">{file.name}</span>}
          </button>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Select label={t("documentSource")} value={source} onChange={setSource} options={["Resident", "Council Department", "Government Agency", "Historic Archive", "Other"]} />
            <Select
              label={t("documentType")}
              value={documentType}
              onChange={setDocumentType}
              options={[
                "Auto-detect",
                "Housing Complaint",
                "Council Tax Query",
                "Parking Appeal",
                "Noise Complaint",
                "Safeguarding Concern",
                "Missed Bin Collection",
                "Planning Application",
                "Historic Handwritten Record",
                "Tenancy Record",
                "Government Letter",
              ]}
            />
            <Select
              label={t("documentCondition")}
              value={condition}
              onChange={setCondition}
              options={["Digital text document", "Scanned document", "Image", "Low-quality scan", "Handwritten historic record"]}
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="panel-card p-6">
            <h2 className="text-lg font-bold">{t("processingOptions")}</h2>
            <div className="mt-4 space-y-3">
              {[
                "Extract key data",
                "Detect sensitive information",
                "Redact GDPR-sensitive data",
                "Generate summary",
                "Translate if needed",
                "Auto-route to department",
                "Store structured data",
                "Run local AI analysis",
              ].map((option) => (
                <label key={option} className="soft-row flex items-center gap-3 p-3 text-sm font-medium">
                  <input checked={selectedOptions.includes(option)} onChange={() => toggleOption(option)} type="checkbox" />
                  {option}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-950">
            {t("secureProcessingNote")}
          </section>

          <button
            className="lift-link w-full rounded-2xl bg-teal-600 px-5 py-4 font-black text-white shadow-xl shadow-teal-300/30 hover:bg-teal-700 disabled:opacity-60 dark:shadow-teal-950/30"
            onClick={processDocument}
            disabled={isUploading}
          >
            {isUploading ? t("sendingSecurely") : t("processDocument")}
          </button>
        </aside>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <select className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-3 py-3 shadow-sm hover:border-teal-200 dark:border-slate-700 dark:bg-slate-950" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
