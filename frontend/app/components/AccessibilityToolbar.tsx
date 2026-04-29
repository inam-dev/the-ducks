import { useEffect, useState } from "react";

interface AccessibilityToolbarProps {
  onClose: () => void;
}

export default function AccessibilityToolbar({ onClose }: AccessibilityToolbarProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      "CouncilPoint. Secure AI powered document intelligence for local councils. DBS based access control and audit logging are enabled.",
    );
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-semibold text-slate-300">Accessibility</span>
          <button className={toolbarButton(darkMode)} onClick={() => setDarkMode((value) => !value)}>
            Dark mode
          </button>
          <button className="rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" onClick={() => setFontSize((value) => Math.max(12, value - 2))}>
            A-
          </button>
          <span className="w-8 text-center text-sm">{fontSize}</span>
          <button className="rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" onClick={() => setFontSize((value) => Math.min(24, value + 2))}>
            A+
          </button>
          <button className={toolbarButton(highContrast)} onClick={() => setHighContrast((value) => !value)}>
            High contrast
          </button>
          <button className={toolbarButton(isSpeaking)} onClick={toggleSpeech}>
            {isSpeaking ? "Stop speech" : "Text to speech"}
          </button>
        </div>
        <button className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-700" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function toolbarButton(active: boolean) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    active ? "bg-yellow-400 text-slate-950" : "bg-slate-700 text-white hover:bg-slate-600"
  }`;
}
