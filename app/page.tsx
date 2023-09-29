"use client";
import React, { useState } from 'react';
import Results from './components/results';
import LoadingIcon from './components/loading';

type RequestData = {
    file: File | null;
    amount: number;
    shipment: number;
} 

const HomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<number>(4);
  const [shipment, setShipment] = useState<number>(48);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

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

    const response = await fetch('/api/opony', {
        method: 'POST',
        body: JSON.stringify({
            file,
            amount,
            shipment,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    setLoading(false);

    if (response.ok) {
        const res = await response.json();
        setResponse(res);
        console.log(res);
    } 
    else {
        setResponse(null);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {loading ? (
             <div className="flex justify-center items-center mb-4">
              <LoadingIcon />
            </div>
       ) : response ? (
          <Results {...response} />
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
                  value={amount}
                  onChange={(e) => setAmount(Number.parseInt(e.target.value))}
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
                  value={shipment}
                  onChange={(e) => setShipment(Number.parseInt(e.target.value))}
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

