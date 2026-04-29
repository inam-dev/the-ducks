export type RiskLevel = "Low" | "Medium" | "High";
export type Urgency = "Low" | "Medium" | "High";

export type SensitiveItem = {
  type:
    | "Name"
    | "Address"
    | "Phone"
    | "Email"
    | "Reference ID"
    | "Medical Info"
    | "Child Mentioned";
  value: string;
  riskLevel: RiskLevel;
  action: "Detected" | "Redacted" | "Flagged";
};

export type ExtractedField = {
  label: string;
  value: string;
};

export type DocumentResult = {
  id: string;
  filename: string;
  source: string;
  documentType: string;
  documentCondition: string;
  language: string;
  historicDocument: boolean;
  handwritingDetected: boolean;
  referenceId: string;
  urgency: Urgency;
  ocrConfidence: number;
  handwritingConfidence: number | null;
  residentName: string;
  address: string;
  aiSummary: string;
  residentFriendlySummary: string;
  gdprScore: number;
  gdprStatus: string;
  riskBeforeRedaction: RiskLevel;
  riskAfterRedaction: RiskLevel;
  gdprWarnings: string[];
  suggestedDepartment: string;
  routingConfidence: number;
  routingReason: string;
  suggestedNextAction: string;
  staffNoteSuggestion: string;
  sensitiveItems: SensitiveItem[];
  extractedFields: ExtractedField[];
  originalText: string;
  redactedText: string;
  translatedText: string;
  auditTrail: string[];
};

export type ArchiveDocument = {
  id: string;
  filename: string;
  source: string;
  documentType: string;
  department: string;
  gdprScore: number;
  status: "Processed" | "Needs Review" | "Restricted";
  uploadedAt: string;
  dbsAccessRequired: string;
  accessLevelRequired: number;
};
