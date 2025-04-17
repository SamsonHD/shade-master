import React from 'react';
import { getContrastRatio, getBestTextColor } from '../utils/colorUtils';

interface ColorShadeDisplayProps {
  shades: string[];
  showContrast: boolean;
  onShadeSelect: (shade: string) => void;
}

export const ColorShadeDisplay: React.FC<ColorShadeDisplayProps> = ({
  shades,
  showContrast,
  onShadeSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="h-20 w-full flex mb-4 rounded-xl overflow-hidden shadow-sm">
        {shades.map((shade, index) => (
          <div
            key={`${shade}-${index}`}
            onClick={() => onShadeSelect(shade)}
            className="flex-1 h-full cursor-pointer transition-transform hover:transform hover:scale-y-110 relative group"
            style={{ backgroundColor: shade }}
            role="button"
            aria-label={`Color shade ${shade}`}
          >
            {showContrast && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1 text-[10px] font-medium">
                <div style={{ color: 'white' }}>
                  White {getContrastRatio(shade, 'white')}
                </div>
                <div style={{ color: 'black' }}>
                  Black {getContrastRatio(shade, 'black')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-gray-700 font-medium mb-6">
        {showContrast
          ? "Hover over shades to see contrast ratios for white and black text"
          : "Select the color shade above to get color values below"}
      </p>
    </div>
  );
}; 