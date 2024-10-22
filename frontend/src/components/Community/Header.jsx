import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box, Avatar, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GridViewIcon from '@mui/icons-material/GridView';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      <Toolbar>
        {/* LinkedIn Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn Logo"
            style={{ width: '35px', marginRight: '10px' }}
          />
        </Box>

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#eef3f8', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', width: '300px' }}>
            <SearchIcon />
            <InputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              style={{ marginLeft: '10px', width: '100%' }}
            />
          </div>
        </Box>

        {/* Icons with spacing */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}> {/* gap of 2 for spacing between icons */}
          <IconButton color="inherit">
            <HomeIcon />
          </IconButton>
          <IconButton color="inherit">
            <PeopleIcon />
          </IconButton>
          <IconButton color="inherit">
            <WorkIcon />
          </IconButton>
          <IconButton color="inherit">
            <MessageIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Box>

        {/* User Avatar with Menu */}
        <IconButton onClick={handleMenu}>
          <Avatar src="https://via.placeholder.com/150" alt="Profile" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>

        {/* Work Icon */}
        <IconButton color="inherit">
          <GridViewIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
