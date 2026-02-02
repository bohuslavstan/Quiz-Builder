'use client';

import { useState } from 'react';

interface BooleanQuestionProps {
  index: number;
  initialText?: string;
  initialPoints?: number;
  initialCorrectAnswer?: string;
  onRemove: () => void;
  onChange: (data: {
    text: string;
    points: number;
    correctAnswer: string;
  }) => void;
}

export default function BooleanQuestion({
  index,
  initialText = '',
  initialPoints = 1,
  initialCorrectAnswer = 'true',
  onRemove,
  onChange,
}: BooleanQuestionProps) {
  const [text, setText] = useState(initialText);
  const [points, setPoints] = useState(initialPoints);
  const [correctAnswer, setCorrectAnswer] = useState(initialCorrectAnswer);

  const handleTextChange = (value: string) => {
    setText(value);
    onChange({ text: value, points, correctAnswer });
  };

  const handlePointsChange = (value: number) => {
    setPoints(value);
    onChange({ text, points: value, correctAnswer });
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value);
    onChange({ text, points, correctAnswer: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
            {index + 1}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            BOOLEAN
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 p-1"
          title="Remove question"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your question"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points
          </label>
          <input
            type="number"
            min="1"
            value={points}
            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 1)}
            className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name={`boolean-${index}`}
                checked={correctAnswer === 'true'}
                onChange={() => handleCorrectAnswerChange('true')}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="text-gray-700">True</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name={`boolean-${index}`}
                checked={correctAnswer === 'false'}
                onChange={() => handleCorrectAnswerChange('false')}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="text-gray-700">False</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
