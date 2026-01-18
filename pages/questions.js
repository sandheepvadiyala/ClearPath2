import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { immigrationFlows } from '../lib/immigrationFlows';

export default function Questions() {
  const [language, setLanguage] = useState('en');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem('clearpath_language') || 'en';
    const flowId = router.query.flow;
    
    if (!flowId || !immigrationFlows[flowId]) {
      router.push('/select');
      return;
    }

    setLanguage(storedLang);
    setFlow(immigrationFlows[flowId]);
  }, [router.query.flow, router]);

  if (!flow) return <div>Loading...</div>;

  const questions = flow.questions;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    // Move to next question or results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    try {
      // Generate output using OpenAI
      const response = await fetch('/api/generate-output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowId: flow.id,
          answers: finalAnswers,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate output');
      }

      const output = await response.json();
      
      // Store output in localStorage
      localStorage.setItem('clearpath_output', JSON.stringify(output));
      localStorage.setItem('clearpath_flowId', flow.id);

      // Navigate to results
      router.push('/results');
    } catch (error) {
      console.error('Error generating output:', error);
      alert('Failed to generate results. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.push('/select');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {question.text[language]}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={loading}
                className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50"
              >
                <span className="text-lg">{option.label[language]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleBack}
            disabled={loading}
            className="mt-6 px-6 py-2 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            ← Back
          </button>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Generating your personalized guide...</p>
          </div>
        )}
      </div>
    </div>
  );
}
