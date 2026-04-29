import { useState, useEffect } from 'react';

interface AccessibilityToolbarProps {
  onClose: () => void;
}

export default function AccessibilityToolbar({ onClose }: AccessibilityToolbarProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(
        'DuckDocs Secure Document Processor. Use the accessibility toolbar to adjust display settings.'
      );
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="bg-slate-800 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-slate-300">Accessibility:</span>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              darkMode ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            aria-pressed={darkMode}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="text-sm">Dark Mode</span>
          </button>

          {/* Font Size Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Font:</span>
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <span className="w-8 text-center text-sm">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="w-8 h-8 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              highContrast ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            aria-pressed={highContrast}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm">High Contrast</span>
          </button>

          {/* Text to Speech */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isSpeaking ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            aria-pressed={isSpeaking}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="text-sm">{isSpeaking ? 'Stop' : 'Speak'}</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          aria-label="Close accessibility toolbar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}