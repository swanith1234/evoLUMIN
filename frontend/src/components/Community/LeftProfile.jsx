import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, Divider, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import HashtagIcon from '@mui/icons-material/Tag';
import AddIcon from '@mui/icons-material/Add';

const LeftProfile = () => {
  // Dynamic user data (this can be fetched from an API or database)
  const [user, setUser] = useState({
    name: 'Deeshan Sharma',
    profilePic: 'https://via.placeholder.com/150', // Placeholder image for now
  });

  useEffect(() => {
    // Here you could fetch the user data from an API or database
    // For now, it's hardcoded for demonstration purposes
    // Example: setUser(fetchUserDataFromAPI());
  }, []);

  return (
    <Box sx={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', width: '100%' }}>
      {/* Profile Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '1rem' }}>
        <Avatar
          alt={user.name}
          src={user.profilePic}
          sx={{ width: 100, height: 100, marginBottom: '0.5rem' }}
        />
        <Typography variant="h6">{`Welcome, ${user.name}!`}</Typography>
        <Button variant="text" color="primary">Add a photo</Button>
      </Box>

      <Divider />

      {/* Connections Section */}
      <Box sx={{ paddingTop: '1rem' }}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Connections
          <IconButton size="small">
            <PeopleIcon />
          </IconButton>
        </Typography>
        <Typography variant="body2" color="primary">Grow Your Network</Typography>
      </Box>

      {/* Items Section */}
      <Box sx={{ paddingTop: '1rem' }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          My Items
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </Typography>
      </Box>

      <Divider sx={{ margin: '1rem 0' }} />

      {/* Groups, Events, etc. Section */}
      <Box>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Groups
          <IconButton size="small">
            <GroupIcon />
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Events
          <IconButton size="small">
            <EventIcon />
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Follow Hashtags
          <IconButton size="small">
            <HashtagIcon />
          </IconButton>
        </Typography>

        {/* Additional options */}
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Lorem Option 1
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Lorem Option 2
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Lorem Option 3
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Lorem Option 4
          <IconButton size="small">
            <AddIcon />
          </IconButton>
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftProfile;
