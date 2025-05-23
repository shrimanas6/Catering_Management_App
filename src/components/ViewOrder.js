import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import ModalData from './ModalData';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'id', label: '#', minWidth: 101, align: 'left' },
  { id: 'name', label: 'Customer Name', minWidth: 101, align: 'left' },
  { id: 'contact', label: 'Contact Number', minWidth: 101, align: 'center' },
  { id: 'date', label: 'Function Date', minWidth: 101, align: 'right' },
  { id: 'place', label: 'Function Place', minWidth: 101, align: 'right' },
  { id: 'note', label: 'Note', minWidth: 101, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 101, align: 'center' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ViewOrder() {
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);
  const [details, setDetails] = React.useState([])

  const navigate = useNavigate()

  React.useEffect(() => {
    getOrders()
  }, [])

  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8082/cater/fetchSessionsBulkOrder");
      setDetails(response?.data);
    } catch (e) {
      console.log("Error fetching orders:", e);
    }
  };

  console.log('data123', details)

  const handleOpen = (row) => {
    console.log('row123', row)
    setModalData(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    console.log('id123', id)
    try {
      const response = await axios.delete(`http://localhost:8082//deleteCustomers/${id}`);
      console.log('response123', response)
    } catch (e) {
      console.log("Error fetching orders:", e);
    }
  }

  const handleClose = () => setOpen(false);

  const shareOnWhatsApp = (row) => {

    const message = `
      Order Details:
      - Customer Name: ${row.name}
      - Contact: ${row.contact}
      - Date: ${row.date}
      - Place: ${row.place}
      - Note: ${row.note}
    `;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };



    const handleEdit = (row) => {
      navigate('/add-order', { state: { row } });
    };
  


  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        sx={{
          // display: 'flex',
          // justifyContent: 'center',
          height: '100vh',
          marginTop: '50px'
        }}
      >
        <Box
          sx={{
            bgcolor: '#ffffff',
            height: '50vh',
          }}
        >
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
                  {details.map((row, index) => (
                    <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.customerName}</TableCell>
                      <TableCell align="center">{row.customerMobile}</TableCell>
                      <TableCell align="right">{row.customerCreateDate}</TableCell>
                      <TableCell align="right">{row.customerAddress}</TableCell>
                      <TableCell align="center">{row.eventNote}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOpen(row)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                            onClick={() => handleDelete(row?.customerId)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                            style={{ cursor: 'pointer' }}
                            onClick={() => shareOnWhatsApp(row)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEdit(row)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L7.75 18.964l-4.25 1.25 1.25-4.25L16.862 3.487Zm0 0L19.5 6.125"
                            />
                          </svg>


                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className='modal-head'>
              Food Order Details
              <CloseIcon onClick={handleClose} />
            </div>
          </Typography>
          {modalData && (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ModalData details={modalData} />
            </Typography>
          )}
        </Box>
      </Modal>
    </React.Fragment>
  );
}
