import type { DocumentResult } from "../types/document";

export const mockDocumentResult: DocumentResult = {
  id: "doc-001",
  filename: "Housing Complaint - Damp and Mould.pdf",
  source: "Resident",
  documentType: "Housing Complaint",
  documentCondition: "Scanned document",
  language: "English",
  historicDocument: false,
  handwritingDetected: false,
  referenceId: "HC-2026-0142",
  urgency: "High",
  ocrConfidence: 94,
  handwritingConfidence: null,
  residentName: "John Smith",
  address: "12 High Street, Hillingdon",
  aiSummary:
    "This document is a housing complaint about damp and mould at a residential property. It mentions a child with asthma, which increases urgency. The recommended council action is to assign the case to Housing Repairs and arrange an inspection within 2 working days.",
  residentFriendlySummary:
    "This document is about damp and mould in a resident's home. The council should prioritise it because it mentions a health risk.",
  gdprScore: 92,
  gdprStatus: "Safe after redaction",
  riskBeforeRedaction: "High",
  riskAfterRedaction: "Low",
  gdprWarnings: [
    "Name detected and redacted",
    "Address detected and redacted",
    "Phone number detected and redacted",
    "Medical information detected and redacted",
    "Child/vulnerable person reference flagged",
    "Share-safe copy generated",
  ],
  suggestedDepartment: "Housing Repairs",
  routingConfidence: 91,
  routingReason: "Document mentions damp, mould, repair, property and inspection.",
  suggestedNextAction:
    "Assign to Housing Repairs and book an inspection within 2 working days.",
  staffNoteSuggestion:
    "Prioritise this case due to damp and mould with a health risk mention. Forward to Housing Repairs for inspection scheduling.",
  sensitiveItems: [
    { type: "Name", value: "John Smith", riskLevel: "Medium", action: "Redacted" },
    { type: "Address", value: "12 High Street, Hillingdon", riskLevel: "High", action: "Redacted" },
    { type: "Phone", value: "07123 456789", riskLevel: "Medium", action: "Redacted" },
    { type: "Medical Info", value: "asthma", riskLevel: "High", action: "Redacted" },
    { type: "Child Mentioned", value: "child", riskLevel: "High", action: "Flagged" },
  ],
  extractedFields: [
    { label: "Case Type", value: "Housing Complaint" },
    { label: "Issue", value: "Damp and mould" },
    { label: "Resident", value: "John Smith" },
    { label: "Address", value: "12 High Street, Hillingdon" },
    { label: "Reference ID", value: "HC-2026-0142" },
    { label: "Health Risk Mentioned", value: "Yes" },
    { label: "Urgency", value: "High" },
    { label: "Suggested Department", value: "Housing Repairs" },
  ],
  originalText:
    "Dear John Smith, I am writing about damp and mould at 12 High Street, Hillingdon. My child has asthma and this is affecting their health. Please arrange an inspection as soon as possible. You can contact me on 07123 456789.",
  redactedText:
    "Dear [REDACTED NAME], I am writing about damp and mould at [REDACTED ADDRESS]. A protected health/safeguarding detail was identified and redacted. Please arrange an inspection as soon as possible. You can contact me on [REDACTED PHONE].",
  translatedText:
    "This is a resident-friendly translated version of the redacted document.",
  auditTrail: [
    "09:41 - Document uploaded by Priya Patel",
    "09:42 - OCR extraction completed",
    "09:42 - Sensitive data detected",
    "09:43 - Redacted copy generated",
    "09:43 - Viewed by authorised user",
    "09:44 - Routed to Housing Repairs",
  ],
};

export function calculateShareSafeScore(items: DocumentResult["sensitiveItems"], redacted = true) {
  const rawScore = items.reduce((score, item) => {
    const riskPenalty = item.riskLevel === "High" ? 8 : item.riskLevel === "Medium" ? 5 : 2;
    return score - 5 - riskPenalty;
  }, 100);

  const adjustedScore = redacted ? Math.max(rawScore + 35, 92) : rawScore;
  return Math.min(100, Math.max(0, adjustedScore));
}
