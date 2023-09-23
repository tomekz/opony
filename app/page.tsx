"use client";
import React, { useState } from 'react';
import Results from './results';
import LoadingIcon from './loading';

const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [field1, setField1] = useState<number>(4);
  const [field2, setField2] = useState<number>(48);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{
    file: File | null;
    field1: number;
    field2: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulate loading time for 1 second
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Handle form submission here, e.g., send data to the server
    // You can access the uploaded file as 'file', field1 as 'field1', and field2 as 'field2'
    const sd = {
      file,
      field1,
      field2,
    };
    setSubmittedData(sd);
    setLoading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {loading ? (
             <div className="flex justify-center items-center mb-4">
              <LoadingIcon />
            </div>
       ) : submittedData ? (
          <Results {...submittedData} />
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Daj mi te oponki</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="file" className="font-semibold text-gray-800">
                  Plik:
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="mt-1 border border-gray-300 p-2 rounded-md text-black"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="field1" className="font-semibold text-gray-800">
                  Ilość opon:
                </label>
                <input
                  type="number"
                  id="field1"
                  value={field1}
                  onChange={(e) => setField1(Number.parseInt(e.target.value))}
                  className="mt-1 border border-gray-300 p-2 rounded-md text-black"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="field2" className="font-semibold text-gray-800">
                  Czas dostawy:
                </label>
                <input
                  type="number"
                  id="field2"
                  value={field2}
                  onChange={(e) => setField2(Number.parseInt(e.target.value))}
                  className="mt-1 border border-gray-300 p-2 rounded-md text-black"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-600 text-gray-100 px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

