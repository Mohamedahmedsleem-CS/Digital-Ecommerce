'use client';

import React from 'react';

function WeightOptions({ 
  options = [], 
  selectedOptions = [], 
  onOptionToggle, 
  isLoading = false 
}) {
  if (!options || options.length === 0) return null;

  const handleOptionToggle = (option) => {
    console.log('🔍 WeightOptions - Option clicked:', option);
    console.log('🔍 WeightOptions - Current selected options:', selectedOptions);
    onOptionToggle(option);
  };

  const isOptionSelected = (optionId) => {
    return selectedOptions.some(selected => selected.id === optionId);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">اختر الوزن:</h3>
      <p className="text-sm text-gray-600">يمكنك اختيار وزن واحد أو أكثر حسب احتياجك</p>
      
      {isLoading ? (
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 w-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((option) => {
            const isSelected = isOptionSelected(option.id);
            const displayName = option.displayName || `${option.value} ${option.unit?.data?.attributes?.shortName || ''}`;
            
            return (
              <button
                key={option.id}
                onClick={() => handleOptionToggle(option)}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 text-center
                  ${isSelected 
                    ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="font-medium text-sm">{displayName}</div>
                {option.price_modifier && option.price_modifier !== 1 && (
                  <div className="text-xs mt-1 opacity-75">
                    {option.price_modifier > 1 ? '+' : ''}
                    {((option.price_modifier - 1) * 100).toFixed(0)}%
                  </div>
                )}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Summary of selected weights */}
      {selectedOptions.length > 0 && (
        <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
          <h4 className="text-sm font-medium text-teal-800 mb-2">الأوزان المختارة:</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedOptions.map((option) => (
              <span 
                key={option.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
              >
                {option.displayName || `${option.value} ${option.unit?.data?.attributes?.shortName || ''}`}
                <button
                  onClick={() => handleOptionToggle(option)}
                  className="ml-1 hover:bg-teal-200 rounded-full w-4 h-4 flex items-center justify-center"
                  title="إزالة هذا الوزن"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          {/* Total weight summary */}
          <div className="text-xs text-teal-700 border-t pt-2">
            <span className="font-medium">إجمالي الوزن المختار: </span>
            <span>{selectedOptions.reduce((total, option) => total + (option.value || 0), 0).toFixed(2)} {selectedOptions[0]?.unit?.data?.attributes?.shortName || ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightOptions;
