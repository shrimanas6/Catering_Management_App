import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import Orders from './Orders';
import { useNavigate } from 'react-router-dom';
import ItemMaster from './ItemMaster';
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from '@mui/icons-material/AccountCircle';


export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate()

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const menuItems = [
    { text: 'Add Order', icon: <ReceiptIcon />, path: '/add-order' },
    { text: 'View Order', icon: <AddShoppingCartIcon />, path: '/view-order' },
    { text: 'Item Master', icon: <InventoryIcon />, path: '/items' },
    { text: 'My Profile', icon: <InventoryIcon />, path: '/profile' },
    { text: 'Settings', icon: <InventoryIcon />, path: '/settings' },
  ];

  const handleNav=(path)=>{
    navigate(path);
    setOpen(false);
  }



  const sideBar = (
    <Box sx={{ width: 250, position: "relative" }} role="presentation">
      {/* Close Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleNav(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider /> */}
    </Box>
  );

  const handleClick=()=>{
    navigate('/profile')
  }
  

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'purple' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleClick} sx={{ marginLeft: "auto" }}>
  <AccountCircle />
</IconButton>

          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {sideBar}
      </Drawer>
    </>
  );
}
