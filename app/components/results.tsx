// Results.tsx
import React from 'react';

interface ResultsProps {}

const Results: React.FC<ResultsProps> = () => {
  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Success!</h1>
      <p className="text-black font-regular">Tu bedzie Link do pobrania pliku z wynikami {}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Wyniki</a>
      </p>
    </div>
  );
};

export default Results;

