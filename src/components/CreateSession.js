import * as React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSessionDetails } from '../ReduxStore/orderSlice';

const CreateSession = () => {
    const data = useLocation()
    const value = data?.state?.row
    const [note, setNote] = React.useState(value?value.eventNote:'');
    const [date, setDate] = React.useState(() => {
        return value ? value.sessionsJsonModel[0].eventDate : new Date().toISOString().split('T')[0];
    });
    const [location, setLocation] = React.useState(value?value.sessionsJsonModel[0].eventLocation:'');
    const [address, setAddress] = React.useState(value?value.sessionsJsonModel[0].eventAddress:'');
    const [sessions, setSessions] = React.useState(() => {
        return value
          ? value.sessionsJsonModel.map((session) => ({
              name: session.sessionName || '',
              startTime: session.sessionBeginTime || '',
              endTime: session.sessionEndTime || '',
              description: session.sessionDescription || '',
              quantity: session.sessionQuantity || '',
            }))
          : [{ name: '', startTime: '', endTime: '', description: '', quantity: '' }];
      });
    const [errors, setErrors] = React.useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const addSessionRow = () => {
        setSessions([...sessions, { name: '', startTime: '', endTime: '', description: '', quantity: '' }]);
    };

    const handleSessionChange = (index, field, value) => {
        const updatedSessions = [...sessions];
        updatedSessions[index][field] = value;
        setSessions(updatedSessions);
    };

    const validateFields = () => {
        let tempErrors = {};
        if (!note) tempErrors.note = "Event note is required";
        if (!date) tempErrors.date = "Date is required";
        if (!location) tempErrors.location = "Location is required";
        if (!address) tempErrors.address = "Address is required";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        let hasValidSession = sessions.some(session => 
            session.name && session.startTime && session.endTime && session.description && session.quantity
        );
    
        if (!validateFields()) return;
    
        if (!hasValidSession) {
            toast.error("Please fill at least one session with valid details!");
            return;
        }
    
        dispatch(setSessionDetails({ note, date, location, address, sessions }));
        navigate('/session',{state:{value}});
    };
    
    return (
        <div style={{ padding: '16px' }}>
            <ToastContainer style={{ fontSize: '14px' }} />
            <Card className="session-cont" style={{ maxWidth: '1000px', margin: 'auto', padding: '16px' }}>
                <div className='group-content'>
                    <h3 style={{ color: 'gray', textAlign: 'center' }}>Create Session</h3>
                    <div>
                        {[{ label: "Event Note", value: note, setValue: setNote, error: errors.note },
                        { label: "Location", value: location, setValue: setLocation, error: errors.location }]
                        .map((field, index) => (
                            <TextField
                                key={index}
                                required
                                label={field.label}
                                value={field.value}
                                onChange={(e) => field.setValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                error={!!field.error}
                                helperText={field.error}
                                sx={{ marginTop: '16px', backgroundColor: '#FAFAFA' }}
                            />
                        ))}
                        <TextField
                            required
                            label="Function Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginTop: '16px', backgroundColor: '#FAFAFA' }}
                        />
                        <TextField
                            required
                            label="Address"
                            multiline
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter the complete address"
                            variant="outlined"
                            fullWidth
                            error={!!errors.address}
                            helperText={errors.address}
                            sx={{ marginTop: '16px', backgroundColor: '#FAFAFA' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <h4 style={{ color: 'gray' }}>Fill the sessions</h4>
                        <Tooltip title="Add Row">
                            <IconButton onClick={addSessionRow}>
                                <AddIcon style={{ color: 'gray' }} />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: '600px' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessions.map((session, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Select
                                                value={session.name}
                                                onChange={(e) => handleSessionChange(index, 'name', e.target.value)}
                                                fullWidth
                                                size="small"
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Select Session</MenuItem>
                                                {['Morning', 'Afternoon', 'Evening', 'Night'].map((option) => (
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        {["startTime", "endTime", "description", "quantity"].map((field, i) => (
                                            <TableCell key={i}>
                                                <TextField
                                                    type={field.includes("Time") ? "time" : "text"}
                                                    value={session[field]}
                                                    onChange={(e) => handleSessionChange(index, field, e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <div style={{ textAlign: 'end', marginTop: '16px' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreateSession;