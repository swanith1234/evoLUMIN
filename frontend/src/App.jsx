// src/App.jsx

import React from 'react';
import PasswordRecoveryModal from './components/PasswordRecoveryModal'
import AuthCard from './components/registration'; // Import the AuthCard component
import './App.css'; // Import your main CSS file (if you have one)

export default function App() {
  return (
    <div>
      <div className="bg-red w-full h-32 text-xl">hii</div>
      <div className="flex justify-center items-center h-screen">
        <AuthCard />  {/* Include the AuthCard component here */}
      </div>
    </div>
  );
}
