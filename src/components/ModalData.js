import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const ModalData = ({ details }) => {
  const [itemMap, setItemMap] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFoodItems, setCurrentFoodItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:8082/cater/fetchAllItems');
        const items = response.data;
        const map = {};
        items.forEach(item => {
          map[item.itemId] = item.itemName;
        });
        setItemMap(map);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleOpenFoodModal = (items) => {
    const itemNames = items.map(item => itemMap[item.itemId] || 'Loading...');
    setCurrentFoodItems(itemNames);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnmrgCWfgo_sMSRqHXnOKALHltLHZeny-4w&s';
    doc.addImage(logoUrl, 'PNG', 10, 10, 50, 15);

    doc.setFontSize(10);
    const header = `Company Name\n1234 Street, City, ZIP\nEmail: contact@company.com | Phone: 1234567890`;
    header.split('\n').forEach((line, i) => doc.text(line, 70, 15 + i * 5));

    let y = 40;
    details.sessionsJsonModel.forEach((session) => {
      doc.setFontSize(12);
      doc.text(`Session: ${session.sessionName}`, 10, y);
      y += 6;
      doc.text(`Date: ${session.eventDate}`, 10, y);
      y += 6;
      doc.text(`Time: ${session.sessionBeginTime} - ${session.sessionEndTime}`, 10, y);
      y += 6;
      doc.text(`People: ${session.sessionQuantity}`, 10, y);
      y += 6;

      const foodNames = session.sessionItemsJsonModels
        .map(item => itemMap[item.itemId])
        .filter(Boolean)
        .join(', ');
      doc.text(`Food Items: ${foodNames}`, 10, y);
      y += 10;
    });

    doc.save('order-info.pdf');
  };

  const columns = [
    { id: 'session', label: 'Session', align: 'left' },
    { id: 'food', label: 'Food Items', align: 'center' },
    { id: 'people', label: 'People', align: 'right' },
    { id: 'begin', label: 'Begin Time', align: 'right' },
    { id: 'end', label: 'End Time', align: 'right' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6">Customer Name</Typography>
          <Typography color="text.secondary">{details?.customerName}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Function Date</Typography>
          <Typography color="text.secondary">{details?.sessionsJsonModel[0]?.eventDate}</Typography>
        </Box>
      </Box>

      {/* PDF Download */}
      <Button variant="contained" onClick={downloadPDF} sx={{ mb: 2 }}>
        Download PDF
      </Button>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align} sx={{ backgroundColor: 'lightgray' }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {details.sessionsJsonModel.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell align="left">{row.sessionName}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenFoodModal(row.sessionItemsJsonModels)}
                    >
                      View Items
                    </Button>
                  </TableCell>
                  <TableCell align="right">{row.sessionQuantity}</TableCell>
                  <TableCell align="right">{row.sessionBeginTime}</TableCell>
                  <TableCell align="right">{row.sessionEndTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Food Items Modal */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Food Items</DialogTitle>
        <DialogContent>
          <Stack spacing={1} direction="row" flexWrap="wrap">
            {currentFoodItems.map((item, idx) => (
              <Chip key={idx} label={item} color="primary" variant="outlined" />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModalData;
