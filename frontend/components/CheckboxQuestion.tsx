'use client';

import { useState } from 'react';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface CheckboxQuestionProps {
  index: number;
  initialText?: string;
  initialPoints?: number;
  initialOptions?: Option[];
  onRemove: () => void;
  onChange: (data: { text: string; points: number; options: Option[] }) => void;
}

export default function CheckboxQuestion({
  index,
  initialText = '',
  initialPoints = 1,
  initialOptions = [{ id: Date.now().toString(), text: '', isCorrect: false }],
  onRemove,
  onChange,
}: CheckboxQuestionProps) {
  const [text, setText] = useState(initialText);
  const [points, setPoints] = useState(initialPoints);
  const [options, setOptions] = useState<Option[]>(initialOptions);

  const notifyChange = (
    newText: string,
    newPoints: number,
    newOptions: Option[]
  ) => {
    onChange({ text: newText, points: newPoints, options: newOptions });
  };

  const handleTextChange = (value: string) => {
    setText(value);
    notifyChange(value, points, options);
  };

  const handlePointsChange = (value: number) => {
    setPoints(value);
    notifyChange(text, value, options);
  };

  const addOption = () => {
    const newOptions = [
      ...options,
      { id: Date.now().toString(), text: '', isCorrect: false },
    ];
    setOptions(newOptions);
    notifyChange(text, points, newOptions);
  };

  const removeOption = (id: string) => {
    const newOptions = options.filter((opt) => opt.id !== id);
    setOptions(newOptions);
    notifyChange(text, points, newOptions);
  };

  const updateOption = (id: string, updates: Partial<Option>) => {
    const newOptions = options.map((opt) =>
      opt.id === id ? { ...opt, ...updates } : opt
    );
    setOptions(newOptions);
    notifyChange(text, points, newOptions);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
            {index + 1}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            CHECKBOX
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

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) =>
                    updateOption(option.id, { isCorrect: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  title="Mark as correct"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    updateOption(option.id, { text: e.target.value })
                  }
                  placeholder="Enter option text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => removeOption(option.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove option"
                  disabled={options.length === 1}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Option
          </button>
        </div>
      </div>
    </div>
  );
}
