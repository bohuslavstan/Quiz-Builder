'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BooleanQuestion from '@/components/BooleanQuestion';
import InputQuestion from '@/components/InputQuestion';
import CheckboxQuestion from '@/components/CheckboxQuestion';
import { api } from '@/lib/api';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  points: number;
  correctAnswer?: string;
  options?: Option[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = (type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type,
      points: 1,
      correctAnswer: type === 'BOOLEAN' ? 'true' : '',
      options:
        type === 'CHECKBOX'
          ? [{ id: Date.now().toString() + '-1', text: '', isCorrect: false }]
          : undefined,
    };

    setQuestions([...questions, newQuestion]);
    setShowTypeSelector(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, data: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...data } : q)));
  };

  const renderQuestionForm = (question: Question, index: number) => {
    switch (question.type) {
      case 'BOOLEAN':
        return (
          <BooleanQuestion
            key={question.id}
            index={index}
            initialText={question.text}
            initialPoints={question.points}
            initialCorrectAnswer={question.correctAnswer}
            onRemove={() => removeQuestion(question.id)}
            onChange={(data) => updateQuestion(question.id, data)}
          />
        );
      case 'INPUT':
        return (
          <InputQuestion
            key={question.id}
            index={index}
            initialText={question.text}
            initialPoints={question.points}
            initialCorrectAnswer={question.correctAnswer}
            onRemove={() => removeQuestion(question.id)}
            onChange={(data) => updateQuestion(question.id, data)}
          />
        );
      case 'CHECKBOX':
        return (
          <CheckboxQuestion
            key={question.id}
            index={index}
            initialText={question.text}
            initialPoints={question.points}
            initialOptions={question.options}
            onRemove={() => removeQuestion(question.id)}
            onChange={(data) => updateQuestion(question.id, data)}
          />
        );
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('Quiz title is required.');
    }

    if (questions.length === 0) {
      newErrors.push('At least one question is required.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const formatPayload = () => {
    return {
      title: title.trim(),
      questions: questions.map((q) => {
        if (q.type === 'BOOLEAN') {
          return {
            type: 'boolean',
            question: q.text,
            correctAnswer: q.correctAnswer === 'true',
          };
        }

        if (q.type === 'INPUT') {
          return {
            type: 'input',
            question: q.text,
            correctAnswer: q.correctAnswer || '',
          };
        }

        const options = (q.options || []).map((opt) => opt.text);
        const correctAnswers = (q.options || [])
          .map((opt, index) => (opt.isCorrect ? index : -1))
          .filter((index) => index !== -1);

        return {
          type: 'checkbox',
          question: q.text,
          options,
          correctAnswers,
        };
      }),
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors([]);
      const payload = formatPayload();
      await api.post('/quizzes', payload);
      router.push('/quizzes');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to create quiz.';
      setErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
        </div>

        {/* Quiz Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">
              Please fix the following:
            </h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Questions ({questions.length})
          </h2>
          <div className="space-y-4">
            {questions.map((question, index) =>
              renderQuestionForm(question, index)
            )}
          </div>
        </div>

        {/* Add Question Button */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowTypeSelector(!showTypeSelector)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Question
          </button>

          {/* Type Selector Dropdown */}
          {showTypeSelector && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
              <button
                onClick={() => addQuestion('BOOLEAN')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div className="font-medium text-gray-900">Boolean</div>
                <div className="text-sm text-gray-500">
                  True/False questions
                </div>
              </button>
              <button
                onClick={() => addQuestion('INPUT')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div className="font-medium text-gray-900">Text Input</div>
                <div className="text-sm text-gray-500">
                  Short answer questions
                </div>
              </button>
              <button
                onClick={() => addQuestion('CHECKBOX')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Multiple Choice</div>
                <div className="text-sm text-gray-500">
                  Questions with multiple options
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Quiz'}
          </button>
          <Link
            href="/quizzes"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
