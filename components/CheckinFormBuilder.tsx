'use client';

import { useState } from 'react';

const defaultFields = ['부서', '직급', '성명', '생년월일', '전화번호'];

export default function CheckinFormBuilder({
  selectedFields,
  setSelectedFields,
}: {
  selectedFields: string[];
  setSelectedFields: (fields: string[]) => void;
}) {
  const [customField, setCustomField] = useState('');

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleAddCustomField = () => {
    const trimmed = customField.trim();
    if (trimmed && !selectedFields.includes(trimmed)) {
      setSelectedFields([...selectedFields, trimmed]);
      setCustomField('');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">출석 체크 항목 선택</h2>

      <div className="flex flex-wrap gap-3">
        {defaultFields.map(field => (
          <label key={field} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => toggleField(field)}
            />
            {field}
          </label>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="추가 항목 입력"
          value={customField}
          onChange={e => setCustomField(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleAddCustomField}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          추가
        </button>
      </div>

      <div className="text-sm text-gray-600">
        선택된 항목: {selectedFields.join(', ') || '없음'}
      </div>
    </div>
  );
}
