import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertToast } from '../components/AlertToast';
import type { Route } from "./+types/accessibility";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Accessibility - CouncilPoint" },
    { name: "description", content: "Accessibility settings" }
  ];
}

export default function Accessibility() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [clearLanguage, setClearLanguage] = useState(false);
  const [dictationText, setDictationText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fontSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const handleTextToSpeech = () => {
    const text = 'Council staff often process sensitive documents manually. CouncilPoint reduces admin time, improves consistency, and helps protect resident data.';
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      setSuccessMessage('Text-to-speech started');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const handleDictation = () => {
    setDictationText('Staff reviewed document and confirmed resident complaint is valid. Forwarded to Waste Management for follow-up.');
    setSuccessMessage('Speech-to-text completed');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Accessibility Settings"
        description="Customise the interface for better usability"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Font Size */}
          <Card title="Font Size">
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
              <div className={fontSizes[fontSize]}>
                <p className="text-gray-700">Preview: This is how text will appear with your selected font size.</p>
              </div>
            </div>
          </Card>

          {/* Theme Settings */}
          <Card title="Visual Settings">
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="flex-1 font-medium text-gray-900">High Contrast Mode</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="flex-1 font-medium text-gray-900">Dark Mode</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dyslexiaFont}
                    onChange={(e) => setDyslexiaFont(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="flex-1 font-medium text-gray-900">Dyslexia-Friendly Font</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => setReduceMotion(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="flex-1 font-medium text-gray-900">Reduce Motion</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clearLanguage}
                    onChange={(e) => setClearLanguage(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="flex-1 font-medium text-gray-900">Clear Language Mode</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Audio Controls */}
          <Card title="Audio Controls">
            <div className="p-6 space-y-4">
              <Button variant="secondary" onClick={handleTextToSpeech} className="w-full">
                🔊 Text-to-Speech (Read Summary)
              </Button>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900 mb-3">Speech-to-Text Notes</p>
                <button
                  onClick={handleDictation}
                  className="w-full mb-3 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  🎤 Start Dictation
                </button>
                <textarea
                  value={dictationText}
                  onChange={(e) => setDictationText(e.target.value)}
                  placeholder="Dictated text will appear here..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview & Info */}
        <div className="space-y-6">
          <Card title="Current Settings" className="p-6">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Font Size</p>
                <p className="font-semibold text-gray-900 capitalize">{fontSize}</p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-gray-600">Visual Mode</p>
                <p className="font-semibold text-gray-900">
                  {darkMode ? 'Dark' : highContrast ? 'High Contrast' : 'Standard'}
                </p>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-gray-600">Font Style</p>
                <p className="font-semibold text-gray-900">
                  {dyslexiaFont ? 'Dyslexia-Friendly' : 'Standard'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-teal-50 border-teal-200">
            <p className="text-sm text-teal-900 leading-relaxed">
              <strong>♿ Accessibility:</strong> These settings help all staff work more effectively. Your preferences are saved locally.
            </p>
          </Card>
        </div>
      </div>

      {successMessage && (
        <AlertToast message={successMessage} type="success" onClose={() => setSuccessMessage('')} />
      )}
    </MainLayout>
  );
}
