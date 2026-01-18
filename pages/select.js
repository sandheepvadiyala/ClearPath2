import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { immigrationFlows } from '../lib/immigrationFlows';

export default function SelectFlow() {
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem('clearpath_language') || 'en';
    setLanguage(storedLang);
  }, []);

  const handleSelectFlow = (flowId) => {
    // Navigate to questions
    router.push(`/questions?flow=${flowId}`);
  };

  const flows = Object.values(immigrationFlows);

  const translations = {
    title: {
      en: 'What do you need help with?',
      es: '¿Con qué necesitas ayuda?',
      zh: '您需要什么帮助？',
      fr: 'De quoi avez-vous besoin d\'aide?',
      ar: 'ما الذي تحتاج المساعدة فيه؟'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            {translations.title[language]}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flows.map((flow) => (
            <button
              key={flow.id}
              onClick={() => handleSelectFlow(flow.id)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left border-2 border-transparent hover:border-indigo-400"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {flow.title[language]}
              </h3>
              <p className="text-gray-600 text-sm">
                Click to start
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-8 mx-auto block px-6 py-2 text-indigo-600 hover:text-indigo-800"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
