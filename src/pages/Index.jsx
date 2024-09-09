import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleUpload = () => {
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">AI Coloring PDF Genie</h1>
        <p className="text-xl text-gray-600 text-center mb-8">
          Transform your images into unique coloring pages with AI magic!
        </p>
        <Button 
          onClick={handleUpload}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
        >
          Upload an Image
        </Button>
      </div>
    </div>
  );
};

export default Index;