import React from 'react';
import './SuggestionProfiles.css';
import profiles from  '../../../public/profiles.json'; 
import MessageIcon from '@mui/icons-material/Message';

function SuggestionProfiles() {
  return (
    <div className="suggestion-profiles">
     <div>
     <h2>Your viewers also viewed</h2>
     </div>    
      <div>
      {profiles.map(profile => (
        <div key={profile.id} className="profile">
          <img src={profile.image} alt={profile.name} className="profile-image" />
          <div className="profile-info">
            <h3>{profile.name}</h3>
            <p>{profile.description}</p>
          </div>
          <MessageIcon className="message-icon" />
        </div>
      ))}
      </div>
    </div>
  );
}

export default SuggestionProfiles;


