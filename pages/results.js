import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Results() {
  const [output, setOutput] = useState(null);
  const [language, setLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState('checklist');
  const router = useRouter();

  useEffect(() => {
    const storedOutput = localStorage.getItem('clearpath_output');
    const storedLang = localStorage.getItem('clearpath_language') || 'en';
    
    if (!storedOutput) {
      router.push('/');
      return;
    }

    setOutput(JSON.parse(storedOutput));
    setLanguage(storedLang);
  }, [router]);

  const generateAudio = async () => {
    if (!output) return;

    setLoadingAudio(true);
    try {
      const text = `${output.summaryText}\n\nHere are your next steps: ${output.checklistItems.join('. ')}`;
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const { audioUrl: url } = await response.json();
      setAudioUrl(url);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please try again.');
    } finally {
      setLoadingAudio(false);
    }
  };

  if (!output) return <div>Loading...</div>;

  const translations = {
    title: {
      en: 'Your Personalized Guide',
      es: 'Tu Guía Personalizada',
      zh: '您的个性化指南',
      fr: 'Votre Guide Personnalisé',
      ar: 'دليلك الشخصي'
    },
    tabs: {
      checklist: { en: 'Checklist', es: 'Lista', zh: '清单', fr: 'Liste', ar: 'قائمة' },
      resources: { en: 'Resources', es: 'Recursos', zh: '资源', fr: 'Ressources', ar: 'موارد' },
      questions: { en: 'Questions for Lawyer', es: 'Preguntas', zh: '问题', fr: 'Questions', ar: 'أسئلة' }
    },
    playAudio: {
      en: 'Listen to Guide',
      es: 'Escuchar Guía',
      zh: '收听指南',
      fr: 'Écouter le Guide',
      ar: 'استمع إلى الدليل'
    },
    summary: {
      en: 'Summary',
      es: 'Resumen',
      zh: '摘要',
      fr: 'Résumé',
      ar: 'ملخص'
    },
    documentsSteps: {
      en: 'Documents & Steps',
      es: 'Documentos y Pasos',
      zh: '文件和步骤',
      fr: 'Documents et Étapes',
      ar: 'الوثائق والخطوات'
    },
    officialResources: {
      en: 'Official Resources',
      es: 'Recursos Oficiales',
      zh: '官方资源',
      fr: 'Ressources Officielles',
      ar: 'الموارد الرسمية'
    },
    questionsForAttorney: {
      en: 'Questions to Ask a Qualified Immigration Attorney',
      es: 'Preguntas para un Abogado de Inmigración Calificado',
      zh: '向合格移民律师咨询的问题',
      fr: 'Questions à Poser à un Avocat d\'Immigration Qualifié',
      ar: 'أسئلة لطرحها على محامي هجرة مؤهل'
    },
    startNew: {
      en: 'Start New Session',
      es: 'Nueva Sesión',
      zh: '开始新会话',
      fr: 'Nouvelle Session',
      ar: 'بدء جلسة جديدة'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-4">
            {translations.title[language]}
          </h1>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {translations.summary[language]}
          </h2>
          <p className="text-gray-700 leading-relaxed">{output.summaryText}</p>
          
          <div className="mt-4 flex gap-4">
            <button
              onClick={generateAudio}
              disabled={loadingAudio}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingAudio ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  🔊 {translations.playAudio[language]}
                </>
              )}
            </button>
          </div>

          {audioUrl && (
            <div className="mt-4">
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b">
            {['checklist', 'resources', 'questions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {translations.tabs[tab][language]}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'checklist' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {translations.documentsSteps[language]}
                </h3>
                <ul className="space-y-3">
                  {output.checklistItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {translations.officialResources[language]}
                </h3>
                <div className="space-y-4">
                  {output.officialLinks.map((link, index) => (
                    <div key={index} className="border-l-4 border-indigo-600 pl-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {link.title} →
                      </a>
                      <p className="text-gray-600 text-sm mt-1">{link.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {translations.questionsForAttorney[language]}
                </h3>
                <ul className="space-y-3">
                  {output.questionsToAsk.map((question, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-indigo-600 text-xl">•</span>
                      <span className="text-gray-700">{question}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Remember:</strong> Always consult with a qualified immigration attorney 
                    for legal advice specific to your situation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('clearpath_output');
              router.push('/select');
            }}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {translations.startNew[language]}
          </button>
        </div>
      </div>
    </div>
  );
}
