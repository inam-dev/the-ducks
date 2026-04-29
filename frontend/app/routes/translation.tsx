import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertToast } from '../components/AlertToast';

export function meta() {
  return [
    { title: "Translation - CouncilPoint" },
    { name: "description", content: "Document translation service" }
  ];
}

export default function Translation() {
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  const [translated, setTranslated] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const languages = ['English', 'Hindi', 'Urdu', 'Polish', 'French', 'Spanish', 'Mandarin', 'German'];

  const originalText = `Resident reports repeated missed food waste collections over a two-week period and requests follow-up from Waste Management. Sensitive personal data has been redacted.`;

  const mockTranslations: { [key: string]: string } = {
    'Hindi': 'निवासी ने दो सप्ताह की अवधि में खाद्य कचरे के दोहराए गए मिस किए गए संग्रह की रिपोर्ट की है और अपशिष्ट प्रबंधन से अनुवर्ती कार्रवाई का अनुरोध करता है। संवेदनशील व्यक्तिगत डेटा को संपादित किया जा चुका है।',
    'Urdu': 'مقیم نے دو ہفتوں کی مدت میں کھانے کی کچرے کی بار بار مسی ہوئی کالیکشن کی رپورٹ کی ہے اور فاضلات کے انتظام سے متابعت کی درخواست کی ہے۔ حساس ذاتی ڈیٹا میں ترمیم کی جا چکی ہے۔',
    'Polish': 'Mieszkaniec zgłasza powtórzone propuszczone zbiórki bioodpadów w okresie dwóch tygodni i prosi o kontynuację ze strony Zarządzania Odpadami. Wrażliwe dane osobowe zostały redagowane.',
    'French': 'Le résident signale des collectes manquées répétées de déchets alimentaires sur une période de deux semaines et demande un suivi de la part de la gestion des déchets. Les données personnelles sensibles ont été masquées.',
    'Spanish': 'El residente informa de recolecciones perdidas repetidas de residuos alimentarios durante un período de dos semanas y solicita seguimiento del Departamento de Gestión de Residuos. Los datos personales sensibles han sido redactados.',
    'Mandarin': '居民報告在兩週內多次錯過食物垃圾收集，並要求廢物管理部門跟進。敏感個人數據已被編輯。',
    'German': 'Der Anwohner meldet wiederholte fehlende Abholungen von Speiseabfällen über einen Zeitraum von zwei Wochen und fordert eine Nachverfolgung durch die Abfallwirtschaft an. Sensible personenbezogene Daten wurden redigiert.'
  };

  const handleTranslate = () => {
    setTranslated(true);
    setSuccessMessage(`Translation to ${targetLanguage} completed.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Translation"
        description="Translate documents to support multilingual residents"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Translation Controls */}
        <div className="lg:col-span-1">
          <Card title="Translation Settings">
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Target Language</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => {
                    setTargetLanguage(e.target.value);
                    setTranslated(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <Button variant="primary" onClick={handleTranslate} className="w-full">
                Translate
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>📝 Note:</strong> Translation preserves meaning and keeps sensitive data redacted.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Text Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original */}
          <Card title="Original Text (English)">
            <div className="p-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-32">
                <p className="text-gray-700 text-sm leading-relaxed">{originalText}</p>
              </div>
            </div>
          </Card>

          {/* Translated */}
          <Card title={`Translated Text (${targetLanguage})`}>
            <div className="p-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 min-h-32">
                {translated ? (
                  <p className="text-gray-700 text-sm leading-relaxed">{mockTranslations[targetLanguage] || 'Translation not available'}</p>
                ) : (
                  <p className="text-gray-500 text-sm italic">Click "Translate" to generate translation...</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {successMessage && (
        <AlertToast message={successMessage} type="success" onClose={() => setSuccessMessage('')} />
      )}
    </MainLayout>
  );
}
