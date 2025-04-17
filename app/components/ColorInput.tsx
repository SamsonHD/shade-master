import React from 'react';
import { generateRandomColor } from '../utils/colorUtils';

interface ColorInputProps {
  baseColor: string;
  onColorChange: (color: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ baseColor, onColorChange }) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  const handleRandomColor = () => {
    onColorChange(generateRandomColor());
  };

  return (
    <div>
      <label className="block text-lg font-semibold text-gray-900 mb-2">
        Enter Color
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-grow w-full sm:w-auto">
          <input
            type="text"
            value={baseColor}
            onChange={handleColorChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            placeholder="Enter color value"
            aria-label="Color input"
          />
          <p className="text-gray-700 text-sm mt-2 font-medium">
            Example: #808080 or rgb(128, 128, 128) or gray
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={handleRandomColor}
            className="flex-1 sm:flex-none px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-medium rounded-lg transition-colors"
            aria-label="Generate random color"
          >
            Get Random Color
          </button>
          <div className="w-20 h-20 rounded-lg border border-gray-300 cursor-pointer overflow-hidden shrink-0">
            <input
              type="color"
              value={baseColor}
              onChange={handleColorChange}
              className="w-full h-full cursor-pointer"
              aria-label="Color picker"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 