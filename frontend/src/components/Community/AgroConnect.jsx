import React from 'react';
import Header from './Header';
import LeftProfile from './LeftProfile';
import Chats from './Chats';
import Posts from './Posts';

const AgroConnect = () => {
  return (
    <>
      {/* Internal CSS styling */}
      <style>{`
        /* Set background and minimum height for the main container */
        .bg-gray-100 {
          background-color: #f7fafc;  
          min-height: 100vh; 
        }

        /* Container styling to center the content and apply spacing */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          margin-top: 1.5rem; /* 6 units in tailwind */
          gap: 1rem; /* space between items */
        }

        /* Sidebar for profile */
        aside {
          width: 25%;
        }

        /* Main content area */
        main {
          width: 50%;
        }

        /* Styling for spacing between sidebars and content */
        .space-x-4 {
          gap: 1rem; /* 4 units in tailwind */
        }

        /* Utility class for centering container horizontally */
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        /* Top margin of 1.5rem (6 units in tailwind) */
        .mt-6 {
          margin-top: 1.5rem;
        }
      `}</style>

      <div className="bg-gray-100">
        <Header />
        <div className="container mx-auto mt-6 space-x-4">
          <aside>
            <LeftProfile />
          </aside>
          <main>
            <Posts />
          </main>
          <aside>
            <Chats />
          </aside>
        </div>
      </div>
    </>
  );
};

export default AgroConnect;
