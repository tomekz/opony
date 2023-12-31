"use client";
import React, { useState } from 'react';
import Results from './components/results';
import LoadingIcon from './components/loading';

const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [season, setSeason] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [producer, setProducer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState<any>(null);
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
    formData.set('secret', secret.toString());

    const response = await fetch('/api/opony', {
        method: 'POST',
        body: formData,
    });

    setLoading(false);
    const { success, error, url } = await response.json();
    setError(error);
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
            { success == false && <div className="text-red-500 mb-4"> {error} </div> }
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
                <label htmlFor="producer" className="font-semibold text-gray-800">
                  Producent:
                </label>
                <input
                  type="text"
                  id="producer"
                  required
                  placeholder="tracmax"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="mt-1 border border-gray-300 p-2 rounded-md text-black"
                />
              </div>
              <div className="flex-col">
                <label htmlFor="secret" className="font-semibold text-gray-800">
                  Sekret:
                </label>
                <input
                  type="password"
                  id="secret"
                  required
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
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
