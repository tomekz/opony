// Results.tsx
import React from 'react';

interface ResultsProps {
  file: File | null;
  field1: number;
  field2: number;
}

const Results: React.FC<ResultsProps> = ({ file, field1, field2 }) => {
  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Success!</h1>
      <p className="text-black font-regular">Tu bedzie Link do pobrania pliku z wynikami {file?.name}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Wyniki</a>
      </p>
      <p>zadana ilosc: {field1}</p>
      <p>zadany czas dostawy: {field2}</p>
    </div>
  );
};

export default Results;

