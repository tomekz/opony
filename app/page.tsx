"use client";
import React, { useState } from 'react';
import Results from './components/results';
import LoadingIcon from './components/loading';

const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [producer, setProducer] = useState<string>('');
  // const [shipment, setShipment] = useState<number>(48);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<any>(null);
  const [url, setUrl] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.set('file', file as Blob);
    formData.set('producer', producer.toString());
    // formData.set('shipment', shipment.toString());

    const response = await fetch('/api/opony', {
        method: 'POST',
        body: formData,
    });

    setLoading(false);
    const { success, url } = await response.json();
    setSuccess(success);
    setUrl(url);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {loading ? (
             <div className="flex justify-center items-center mb-4">
              <LoadingIcon />
            </div>
       ) : success ? (
          <Results url={url} />
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
                  required
                  onChange={handleFileChange}
                  className="mt-1 border border-gray-300 p-2 rounded-md text-black"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="field1" className="font-semibold text-gray-800">
                  Producent:
                </label>
                <input
                  type="text"
                  id="producer"
                  required
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
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
