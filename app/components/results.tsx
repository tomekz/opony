// Results.tsx
import React from 'react';

interface ResultsProps {
    url: string;
}

const Results: React.FC<ResultsProps> = ({url})=> {
  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Success!</h1>
      <p className="text-black font-regular">Tu bedzie Link do pobrania pliku z wynikami 
        <br />
        <span role="img" aria-label="party popper">
            <a href={url} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Wyniki</a>
        </span>
      </p>
    </div>
  );
};

export default Results;
