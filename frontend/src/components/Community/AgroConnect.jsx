import React from 'react';
import Header from './Header';
import LeftProfile from './LeftProfile';
import Chats from './Chats';
import Posts from './Posts';

const AgroConnect = () => {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    marginTop: '1.5rem',
    gap: '1rem',
  };

  return (
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <Header />
      <div style={containerStyle}>
        <aside style={{ width: '25%' }}>
          <LeftProfile />
        </aside>
        <main style={{ width: '50%' }}>
          <Posts />
        </main>
        <aside style={{ width: '25%' }}>
          <Chats />
        </aside>
      </div>
    </div>
  );
};

export default AgroConnect;
