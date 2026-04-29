import { mockArchiveDocuments } from "../data/mockArchiveDocuments";
import { mockDocumentResult } from "../data/mockDocumentResult";
import type { ArchiveDocument, DocumentResult } from "../types/document";

const API_BASE_URL = "http://localhost:8080/api";
const LATEST_DOCUMENT_KEY = "councilpoint_latest_document";

async function requestWithFallback<T>(path: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getDocuments(): Promise<ArchiveDocument[]> {
  // Future backend endpoint: GET /documents
  return requestWithFallback("/documents", mockArchiveDocuments);
}

export async function getDocumentResult(id = "doc-001"): Promise<DocumentResult> {
  const stored = getLatestDocumentResult();
  if (stored && (id === "doc-001" || stored.id === id)) {
    return stored;
  }

  return requestWithFallback(`/documents/${id}`, mockDocumentResult);
}

export async function uploadDocument(file: File): Promise<DocumentResult> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await requestWithFallback(
    "/documents/upload",
    demoFallbackForUpload(file),
    { method: "POST", body: formData },
  );

  saveLatestDocumentResult(result);
  return result;
}

export async function redactDocument(id: string): Promise<DocumentResult> {
  // Future backend endpoint: POST /documents/:id/redact
  return requestWithFallback(`/documents/${id}/redact`, mockDocumentResult, { method: "POST" });
}

export async function translateDocument(id: string, language: string): Promise<{ translatedText: string }> {
  return requestWithFallback(
    `/documents/${id}/translate`,
    { translatedText: `${mockDocumentResult.translatedText} Requested language: ${language}.` },
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language }),
    },
  );
}

export function getLatestDocumentResult(): DocumentResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(LATEST_DOCUMENT_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as DocumentResult;
  } catch {
    window.localStorage.removeItem(LATEST_DOCUMENT_KEY);
    return null;
  }
}

function saveLatestDocumentResult(result: DocumentResult) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LATEST_DOCUMENT_KEY, JSON.stringify(result));
  }
}

function demoFallbackForUpload(file: File): DocumentResult {
  const lowerName = file.name.toLowerCase();
  if (
    lowerName.includes("prescription") ||
    lowerName.includes("rx") ||
    lowerName.includes("medicine") ||
    lowerName.includes("medical")
  ) {
    return {
      ...mockDocumentResult,
      id: "doc-prescription-demo",
      filename: file.name,
      documentType: "Medical Prescription",
      urgency: "Medium",
      referenceId: "CP-PRESCRIPTION",
      aiSummary:
        "Demo OCR extracted a prescription for John Doe, age 23, with DOB redacted. The prescription notes fever and Paracetamol 2000 mg three times daily, signed by a doctor on 29/04/2026.",
      suggestedDepartment: "Public Health Review",
      routingConfidence: 88,
      suggestedNextAction: "Review the redacted prescription details and assign to Public Health Review.",
      sensitiveItems: [
        { type: "Name", value: "John Doe", riskLevel: "Medium", action: "Redacted" },
        { type: "Reference ID", value: "DOB [REDACTED]", riskLevel: "High", action: "Redacted" },
        { type: "Medical Info", value: "Fever; Paracetamol dosage", riskLevel: "High", action: "Flagged" },
      ],
      extractedFields: [
        { label: "Patient", value: "John Doe" },
        { label: "Age", value: "23" },
        { label: "DOB", value: "[REDACTED DOB]" },
        { label: "RX", value: "Fever" },
        { label: "Medication", value: "Paracetamol" },
        { label: "Dosage", value: "2000 mg three times daily" },
        { label: "Prescription Date", value: "29/04/2026" },
        { label: "Suggested Department", value: "Public Health Review" },
      ],
      originalText:
        "Demo OCR transcription from uploaded prescription image.\nPatient name : John Doe\nage : 23\nDOB : 11/05/2003\n\nRX : Fever\n\nParacetamol\n2000 mg three times daily\n\nsignature doctor\nDate : 29/04/2026\n",
      redactedText:
        "Demo OCR transcription from uploaded prescription image.\nPatient name : [REDACTED NAME]\nage : 23\nDOB : [REDACTED DOB]\n\nRX : Fever\n\nParacetamol\n[REDACTED DOSAGE]\n\nsignature doctor\nDate : 29/04/2026\n",
    };
  }

  return { ...mockDocumentResult, filename: file.name };
}
