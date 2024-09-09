import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleUpload = () => {
    navigate('/upload');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">AI Coloring PDF Genie</h1>
        <p className="text-xl text-gray-600 mb-8">Create unique coloring pages with AI magic!</p>
        <Button 
          onClick={handleUpload}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Upload an Image
        </Button>
      </div>
    </div>
  );
};

export default Index;