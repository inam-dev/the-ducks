import { mockArchiveDocuments } from "../data/mockArchiveDocuments";
import { mockDocumentResult } from "../data/mockDocumentResult";
import type { ArchiveDocument, DocumentResult } from "../types/document";

const API_BASE_URL = "http://localhost:3000";

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
  // Future backend endpoint: GET /documents/:id
  return requestWithFallback(`/documents/${id}`, mockDocumentResult);
}

export async function uploadDocument(file: File): Promise<{ id: string; filename: string }> {
  // Future backend endpoint: POST /documents/upload
  const formData = new FormData();
  formData.append("file", file);

  return requestWithFallback(
    "/documents/upload",
    { id: "doc-001", filename: file.name },
    { method: "POST", body: formData },
  );
}

export async function redactDocument(id: string): Promise<DocumentResult> {
  // Future backend endpoint: POST /documents/:id/redact
  return requestWithFallback(`/documents/${id}/redact`, mockDocumentResult, { method: "POST" });
}

export async function translateDocument(id: string, language: string): Promise<{ translatedText: string }> {
  // Future backend endpoint: POST /documents/:id/translate
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
