import { useState } from 'react';
import { useRouter } from 'next/router';
import { languages } from '../lib/immigrationFlows';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const router = useRouter();

  const handleStart = () => {
    // Store language in localStorage
    localStorage.setItem('clearpath_language', selectedLanguage);
    
    // Navigate to flow selection
    router.push('/select');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">ClearPath</h1>
          <p className="text-gray-600 text-lg">
            Your multilingual guide to immigration tasks
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choose Your Language / Elige tu idioma / 选择您的语言
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl mr-3">{lang.flag}</span>
                  <span className="text-lg font-medium">{lang.name}</span>
                  {selectedLanguage === lang.code && (
                    <span className="ml-auto text-indigo-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </button>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> ClearPath provides general guidance based on official sources. 
            This is NOT legal advice. Please consult a qualified immigration attorney for your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
}
