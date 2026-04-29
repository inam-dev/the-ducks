import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import type { AppOutletContext } from "../types/app";

export function meta() {
  return [
    { title: "CouncilPoint - Processing" },
    { name: "description", content: "Secure document processing pipeline" },
  ];
}

const steps = [
  "Upload received securely",
  "File encrypted for processing",
  "OCR scan started",
  "Handwriting recognition checked",
  "Text extracted",
  "Local AI/NLP analysis running",
  "Sensitive data detected",
  "GDPR redaction prepared",
  "GDPR Share-Safe Score calculated",
  "Department routing selected",
  "Summary generated",
  "Structured data saved to PostgreSQL",
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const { t } = useOutletContext<AppOutletContext>();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(steps.length - 1, current + 1));
    }, 280);

    const redirect = window.setTimeout(() => navigate("/results"), 4200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">{t("processingPipeline")}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {t("processingDescription")}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-5">
        {[
          ["AI Engine", "Local Secure AI / Ollama-ready"],
          ["OCR Pipeline", "Active"],
          ["Processing mode", "Server-side"],
          ["Database", "PostgreSQL"],
          ["Data leaves council network", "No"],
        ].map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-black">{value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {steps.map((step, index) => {
            const complete = index <= activeStep;
            const current = index === activeStep;
            return (
              <div key={step} className={`rounded-lg border p-4 ${complete ? "border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-950/40" : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800"}`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${complete ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold">{step}</p>
                    {current && <p className="text-sm text-teal-700 dark:text-teal-300">{t("runningNow")}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
