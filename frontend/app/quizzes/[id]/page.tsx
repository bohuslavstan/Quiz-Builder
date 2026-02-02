'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: number;
  text?: string;
  question?: string;
  type: string;
  points?: number;
  options?: Option[];
  answer?: boolean;
  correctAnswer?: string;
  correctAnswers?: number[];
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Quiz>(`/quizzes/${id}`);
        setQuiz(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to fetch quiz');
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const renderQuestion = (question: Question) => {
    const questionType = question.type.toUpperCase();
    switch (questionType) {
      case 'BOOLEAN':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                disabled
                className="h-4 w-4 text-blue-600 border-gray-300 cursor-not-allowed"
              />
              <label className="text-gray-700">True</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                disabled
                className="h-4 w-4 text-blue-600 border-gray-300 cursor-not-allowed"
              />
              <label className="text-gray-700">False</label>
            </div>
          </div>
        );

      case 'INPUT':
        return (
          <div>
            <input
              type="text"
              disabled
              placeholder="Answer input field"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        );

      case 'CHECKBOX':
        return (
          <div className="space-y-2">
            {question.options && question.options.length > 0 ? (
              question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-not-allowed"
                  />
                  <label className="text-gray-700">{option.text}</label>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No options available</p>
            )}
          </div>
        );

      default:
        return <p className="text-gray-500 italic">Unknown question type</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error || 'Quiz not found'}</p>
          <Link
            href="/quizzes"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/quizzes"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Quizzes
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="text-gray-600">{quiz.description}</p>
            )}
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {quiz.questions.length}{' '}
                {quiz.questions.length === 1 ? 'question' : 'questions'}
              </span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No questions yet
              </h3>
              <p className="mt-1 text-gray-500">
                This quiz doesn't have any questions added yet.
              </p>
            </div>
          ) : (
            quiz.questions.map((question, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.points || 1}{' '}
                        {(question.points || 1) === 1 ? 'point' : 'points'}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {question.text || question.question}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 pl-8">
                  {renderQuestion(question, index)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
