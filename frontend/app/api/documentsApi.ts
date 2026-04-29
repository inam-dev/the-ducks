
const API_BASE = 'http://localhost:3000';

// Mock data for fallback
const mockDocuments = [
  {
    id: '1',
    name: 'housing-repair-request.pdf',
    uploadedAt: '2026-04-29T10:30:00Z',
    status: 'processed',
    gdprScore: 92,
    gdprStatus: 'Safe after redaction',
    department: {
      name: 'Housing Repairs',
      confidence: 91,
      reason: 'document mentions damp, mould, repair, property and inspection',
      suggestedAction: 'Book inspection within 2 working days'
    },
    sensitiveData: [
      { type: 'Name', original: 'John Smith', redacted: '██████', status: 'Redacted' },
      { type: 'Address', original: '42 Maple Street, Birmingham B1 2AB', redacted: '█████████████', status: 'Redacted' },
      { type: 'Phone', original: '0121 456 7890', redacted: '██████████', status: 'Redacted' },
      { type: 'Email', original: 'john.smith@email.com', redacted: '████████████', status: 'Redacted' },
      { type: 'NI Number', original: 'AB 12 34 56 C', redacted: '███████████', status: 'Redacted' },
      { type: 'Date of Birth', original: '15/03/1985', redacted: '██/██/████', status: 'Detected' }
    ],
    extractedData: {
      propertyAddress: '42 Maple Street, Birmingham B1 2AB',
      issueType: 'Damp and mould in bedroom',
      reportedDate: '2026-04-25',
      urgency: 'High',
      tenantName: 'REDACTED',
      contactNumber: 'REDACTED'
    },
    translation: {
      originalLanguage: 'English',
      availableLanguages: ['English', 'Welsh', 'Polish', 'Urdu', 'Bengali']
    }
  },
  {
    id: '2',
    name: 'planning-application.docx',
    uploadedAt: '2026-04-28T14:15:00Z',
    status: 'processed',
    gdprScore: 78,
    gdprStatus: 'Review required',
    department: {
      name: 'Planning',
      confidence: 85,
      reason: 'contains planning application keywords',
      suggestedAction: 'Forward to planning officer'
    },
    sensitiveData: [
      { type: 'Name', original: 'Sarah Johnson', redacted: '██████', status: 'Redacted' },
      { type: 'Address', original: '15 High Street', redacted: '██████████', status: 'Redacted' }
    ],
    extractedData: {},
    translation: {
      originalLanguage: 'English',
      availableLanguages: ['English', 'Welsh']
    }
  }
];

export interface SensitiveDataItem {
  type: string;
  original: string;
  redacted: string;
  status: 'Detected' | 'Redacted';
}

export interface DepartmentSuggestion {
  name: string;
  confidence: number;
  reason: string;
  suggestedAction: string;
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  status: 'pending' | 'processing' | 'processed' | 'error';
  gdprScore?: number;
  gdprStatus?: string;
  department?: DepartmentSuggestion;
  sensitiveData?: SensitiveDataItem[];
  extractedData?: Record<string, string>;
  translation?: {
    originalLanguage: string;
    availableLanguages: string[];
  };
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithFallback<T>(endpoint: string, mockData: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error('API unavailable');
    return await response.json();
  } catch {
    // Fallback to mock data
    console.log(`Using mock data for ${endpoint}`);
    return mockData;
  }
}

export async function getDocuments(): Promise<Document[]> {
  return fetchWithFallback('/api/documents', mockDocuments);
}

export async function getDocument(id: string): Promise<Document | undefined> {
  const docs = await getDocuments();
  return docs.find(d => d.id === id);
}

export async function uploadDocument(file: File): Promise<Document> {
  // Try real API first
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  } catch {
    // Mock upload response
    await delay(1500);
    
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      uploadedAt: new Date().toISOString(),
      status: 'processing'
    };
    
    return newDoc;
  }
}

export async function processDocument(id: string): Promise<Document> {
  // Simulate processing
  await delay(3000);
  
  return {
    id,
    name: 'processing-document.pdf',
    uploadedAt: new Date().toISOString(),
    status: 'processed',
    gdprScore: 92,
    gdprStatus: 'Safe after redaction',
    department: {
      name: 'Housing Repairs',
      confidence: 91,
      reason: 'document mentions damp, mould, repair, property and inspection',
      suggestedAction: 'Book inspection within 2 working days'
    },
    sensitiveData: [
      { type: 'Name', original: 'John Smith', redacted: '██████', status: 'Redacted' },
      { type: 'Address', original: '42 Maple Street, Birmingham B1 2AB', redacted: '█████████████', status: 'Redacted' },
      { type: 'Phone', original: '0121 456 7890', redacted: '██████████', status: 'Redacted' },
      { type: 'Email', original: 'john.smith@email.com', redacted: '████████████', status: 'Redacted' },
      { type: 'NI Number', original: 'AB 12 34 56 C', redacted: '███████████', status: 'Redacted' },
      { type: 'Date of Birth', original: '15/03/1985', redacted: '██/██/████', status: 'Detected' }
    ],
    extractedData: {
      propertyAddress: '42 Maple Street, Birmingham B1 2AB',
      issueType: 'Damp and mould in bedroom',
      reportedDate: '2026-04-25',
      urgency: 'High',
      tenantName: 'REDACTED',
      contactNumber: 'REDACTED'
    },
    translation: {
      originalLanguage: 'English',
      availableLanguages: ['English', 'Welsh', 'Polish', 'Urdu', 'Bengali']
    }
  };
}