import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { uploadDocument } from '../api/documentsApi';

export function meta() {
  return [
    { title: "DuckDocs - Upload Document" },
    { name: "description", content: "Upload documents for secure processing" },
  ];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadDocument(file);
      navigate('/processing');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  const supportedFormats = ['PDF', 'DOCX', 'DOC', 'TXT', 'PNG', 'JPG'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Upload Document</h1>
        <p className="text-slate-600 mt-1">Upload a document for secure processing and analysis</p>
      </div>

      {/* Upload Area */}
      <div
        className={`bg-white rounded-xl shadow-sm border-2 border-dashed transition-colors ${
          dragOver
            ? 'border-teal-500 bg-teal-50'
            : file
            ? 'border-teal-500 bg-teal-50/30'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="p-8">
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Remove file"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-700 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-slate-500 mb-6">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                Select File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Supported Formats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Supported Formats</h2>
        <div className="flex flex-wrap gap-2">
          {supportedFormats.map((format) => (
            <span
              key={format}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      {file && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {uploading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload & Process
              </>
            )}
          </button>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">What happens next?</h3>
            <p className="text-sm text-blue-700">
              Your document will be automatically processed to extract key data, detect sensitive information, 
              calculate a GDPR Share-Safe Score, and suggest the appropriate council department for routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}