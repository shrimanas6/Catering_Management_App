import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ModalData = () => {
  const columns = [
    { id: 'session', label: 'Session', minWidth: 100, align: 'left' },
    { id: 'food', label: 'Food Item', minWidth: 100, align: 'center' },
    { id: 'people', label: 'People', minWidth: 100, align: 'right' },
    { id: 'timing', label: 'Timing', minWidth: 100, align: 'right' },
  ];

  const initialData = [
    {
      session: 'Morning',
      foodItems: 'Gobi',
      quantity: '10',
      timing: '8:30am',
    },
    {
      session: 'Afternoon',
      foodItems: 'Masala Dosa',
      quantity: '20',
      timing: '9:00pm',
    },
  ];

  const [data] = useState(initialData);

  // Download PDF Function
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add logo
    const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnmrgCWfgo_sMSRqHXnOKALHltLHZeny-4w&s'; // Replace with your logo URL or base64 encoded string
    const imgWidth = 50; // Adjust width of logo
    const imgHeight = 15; // Adjust height of logo
    const logoXPos = 10; // X position of logo
    const logoYPos = 10; // Y position of logo
  
    doc.addImage(logoUrl, 'PNG', logoXPos, logoYPos, imgWidth, imgHeight);
  
    // Add header text next to the logo
    const headerText = `
      Company Name
      1234, Street Name, City, State - ZIP
      Email: contact@company.com | Phone: +1234567890
    `;
  
    const headerXPos = logoXPos + imgWidth + 10; // Align header to the right of the logo
    const headerYPos = logoYPos + 5; // Slightly lower to align with logo center
  
    doc.setFontSize(10);
    const headerLines = headerText.trim().split('\n');
    headerLines.forEach((line, index) => {
      doc.text(line.trim(), headerXPos, headerYPos + index * 5); // Spacing between header lines
    });
  
    // Add title below the header
    // const titleText = 'Order Information';
    const titleYPos = logoYPos + imgHeight + 10; // Position below logo and header
  
    doc.setFontSize(16);
    // doc.text(titleText, 10, titleYPos);
  
    // Add table
    const tableStartY = titleYPos + 10; // Position table below the title
  
    doc.autoTable({
      head: [['Session', 'Food Items', 'Quantity', 'Timing']], // Column labels
      body: data.map((row) => [row.session, row.foodItems, row.quantity, row.timing]),
      startY: tableStartY,
    });
  
    // Save PDF
    doc.save('order-info.pdf');
  };
  
  

  return (
    <div>
      <div className="head">
        <div className="data">
          <h5>Customer Name</h5>
          <h5 className="light">Rakshan</h5>
        </div>

        <div className="data">
          <h5>Function Date</h5>
          <h5 className="light">16-Oct-2024</h5>
        </div>
      </div>

      <div>
        <h5>Order Info</h5>
        <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ mb: 2 }}>
          Download PDF
        </Button>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: 'lightgray',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">{row.session}</TableCell>
                    <TableCell align="center">{row.foodItems}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{row.timing}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default ModalData;
