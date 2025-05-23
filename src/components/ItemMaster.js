import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Tab, TextField, Button, FormControlLabel, Radio, RadioGroup, Card, CardContent, Typography, Grid, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, MenuItem, Select } from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';

const ItemMaster = () => {
  const [value, setValue] = useState('1');
  const [status, setStatus] = useState('active');
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogTwo, setOpenDialogTwo] = useState(false)
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === '2') fetchItems();
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSave = async () => {
    console.log('itemName123', itemName)
    if (!itemName?.trim()) {
      toast.error('Item Name is mandatory');
      return;
    }

    if (!itemDesc) {
      toast.error('Description is mandatory');
      return;
    }


    let payload

    if (editId) {
      payload = {
        itemId: editId,
        itemName,
        itemDesc,
        itemStatus: status === 'active' ? 'Active' : 'Inactive'
      };
    } else {
      payload = {
        itemName,
        itemDesc,
        itemStatus: status === 'active' ? 'Active' : 'Inactive'
      };
    }

    try {
      await axios.post('http://localhost:8082/cater/saveItemInfo', payload);
      toast.success('Item saved successfully!');
      setItemName('');
      setItemDesc('');
      setStatus('active');
      fetchItems()
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };


  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8082/cater/fetchAllItems');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch items');
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8082/cater/deleteItems/${deleteId}`);
      toast.success('Item deleted successfully!');
      setItems(items.filter(item => item.itemId !== deleteId));
      setOpenDialogTwo(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialogTwo(true);
  }

  const handleDeleteAll = () => {
    setOpenDialog(true)
  }

  const confirmHandleDeleteAll = async () => {
    try {
      await axios.delete(`http://localhost:8082/cater/deleteItems`);
      toast.success('Deleted successfully!');
      setItems([])
      setOpenDialog(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  }

  const handleEdit = (id) => {
    const itemToEdit = items.find(item => item.itemId === id);
    if (itemToEdit) {
      setItemName(itemToEdit?.itemName);
      setItemDesc(itemToEdit?.itemDesc);
      setStatus(itemToEdit?.itemStatus?.toLowerCase());
      setEditId(id);
      setModalOpen(true);  // Open modal
    }

  };


  const filteredItems = items.filter(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
  console.log('filteredItems', filteredItems)

  return (
    <div>
      <ToastContainer style={{ fontSize: '14px' }} />
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="Item Master Tabs">
              <Tab label="Add Item" value="1" />
              <Tab label="View Items" value="2" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <Card sx={{ maxWidth: 600, margin: 'auto', background: '#FAFAFA', boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', color: 'black' }}>
                  Add Item
                </Typography>
                <form>
                  <TextField fullWidth label="Item Name" margin="normal" value={itemName} onChange={(e) => setItemName(e.target.value)} sx={{ background: '#FAFAFA', borderRadius: 1 }} />
                  <TextField
                    fullWidth
                    label="Description"
                    margin="normal"
                    multiline
                    rows={3}
                    value={itemDesc}
                    onChange={(e) => {
                      if (e.target.value.length <= 67) {
                        setItemDesc(e.target.value);
                      }
                    }}
                    helperText={`${itemDesc.length}/67 characters`}
                    sx={{ background: '#FAFAFA', borderRadius: 1 }}
                  />

                  <RadioGroup row value={status} onChange={handleStatusChange}>
                    <FormControlLabel value="active" control={<Radio />} label="Active" sx={{ color: 'black' }} />
                    <FormControlLabel value="inactive" control={<Radio />} label="Inactive" sx={{ color: 'black' }} />
                  </RadioGroup>
                  <Button variant="contained" color="primary" sx={{ display: 'block', margin: '20px auto', backgroundColor: '#1e88e5' }} onClick={handleSave}>
                    Save
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="2">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <TextField
                label="Search Item"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: '100%',
                  maxWidth: '300px',
                  '@media (max-width: 450px)': {
                    maxWidth: '160px', // Reduce width on small screens
                    '& .MuiInputBase-root': {
                      height: '35px', // Reduce height of input
                      fontSize: '14px' // Reduce font size
                    }
                  }
                }}
              />
              <Button
                onClick={handleDeleteAll}
                color="error"
                startIcon={<Delete fontSize="small" className="deleteIcon" />} 
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }, 
                  padding: { xs: '4px 6px', sm: '6px 10px' }, 
                  minWidth: 'auto',
                  '@media (max-width: 479px)': {
                    fontSize: '0.7rem', 
                  },
                }}
              >
                Delete All
              </Button>


            </Box>
            <Grid container spacing={2}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
                  <Card sx={{ background: '#f5f5f5', boxShadow: 1, borderRadius: 1, position: 'relative', padding: 1 }}>
                    <CardContent sx={{ padding: '8px' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {item.itemName}
                      </Typography>
                      <Box sx={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem', lineHeight: '1.2' }}
                        >
                          {item.itemDesc}
                        </Typography>
                      </Box>
                      <Box
                        component="hr"
                        sx={{
                          border: '0',
                          height: '1px',
                          backgroundColor: '#D3D3D3', // Light black color
                          margin: '8px 0',
                        }}
                      />
                      <Typography variant="body2" color={item.itemStatus === 'Active' ? 'green' : 'red'} sx={{ fontSize: '0.8rem' }}>
                        {item.itemStatus}
                      </Typography>

                      {/* Edit and Delete Icons */}
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(parseInt(item.itemId))} sx={{ position: 'absolute', top: 4, right: 32, padding: 0 }}>
                          <Edit fontSize="small" color="black" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(item.itemId)} sx={{ position: 'absolute', top: 4, right: 4, padding: 0 }}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>

                    </CardContent>
                  </Card>
                </Grid>
              ))}

            </Grid>

          </TabPanel>
        </TabContext>
      </Box>
      <Dialog open={openDialogTwo} onClose={() => setOpenDialogTwo(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogTwo(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all the item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmHandleDeleteAll} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              label="Item Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
              fullWidth
              variant="outlined"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ItemMaster;