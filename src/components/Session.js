import * as React from 'react';
import {
    Card, Button, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton, Tabs, Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Session() {
    const location = useLocation();
    const value = location?.state?.value;
    console.log('value321',value)
    const [food, setFood] = React.useState('');
    const [filteredFood, setFilteredFood] = React.useState([]);
    const [selectedSession, setSelectedSession] = React.useState(0);
    const [sessionFood, setSessionFood] = React.useState({});
    const [items, setItems] = React.useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const createSessionDetails = useSelector(state => state.order.sessionDetails);
    const sessions = createSessionDetails?.sessions || [];

    React.useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:8082/cater/fetchAllItems');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    // Initialize sessionFood from edit mode value
    React.useEffect(() => {
        if (items.length > 0 && value?.sessionsJsonModel?.length > 0 && sessions.length > 0) {
            const initialSessionFood = value.sessionsJsonModel.reduce((acc, session) => {
                acc[session.sessionName] = session.sessionItemsJsonModels.map(item => ({
                    itemId: item.itemId,
                    itemName: items.find(i => i.itemId === item.itemId)?.itemName || 'Unknown Item',
                    itemDesc: item.itemDesc,
                    subItemId: item.subItemId,
                    createdBy: item.createdBy,
                    modifiedBy: item.modifiedBy
                }));
                return acc;
            }, {});
            setSessionFood(initialSessionFood);
        } else if (sessions.length > 0) {
            // Fallback to empty setup if not editing
            const initialSessionFood = sessions.reduce((acc, session) => {
                acc[session.name] = [];
                return acc;
            }, {});
            setSessionFood(initialSessionFood);
        }
    }, [items, value, sessions]);

    const handleFoodChange = (e) => {
        const input = e.target.value;
        setFood(input);

        if (input) {
            const filtered = items
                .filter((p) => p.itemStatus === "Active" && p.itemName.toLowerCase().includes(input.toLowerCase()))
                .map((p) => p.itemName);
            setFilteredFood(filtered);
        } else {
            setFilteredFood([]);
        }
    };

    const selectFood = (food) => {
        setFood(food);
        setFilteredFood([]);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (food && sessions.length > 0) {
            const sessionName = sessions[selectedSession].name;
            const selectedItem = items.find((item) => item.itemName === food);
            if (!selectedItem) {
                toast.error("Item not found");
                return;
            }
            const foodObject = {
                itemId: selectedItem.itemId,
                itemName: selectedItem.itemName,
                itemDesc: selectedItem.itemDesc,
                subItemId: sessionFood[sessionName]?.length + 1,
                createdBy: 1,
                modifiedBy: 1
            };
            setSessionFood((prev) => ({
                ...prev,
                [sessionName]: [...(prev[sessionName] || []), foodObject],
            }));
            setFood('');
        } else {
            toast.error("Please add item");
        }
    };

    const handleDelete = (index) => {
        const sessionName = sessions[selectedSession].name;
        setSessionFood((prev) => ({
            ...prev,
            [sessionName]: prev[sessionName].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = () => {
        const sessionsJsonModel = sessions.map((session) => ({
            sessionName: session.name,
            sessionBeginTime: session.startTime,
            sessionEndTime: session.endTime,
            sessionDescription: session.description,
            sessionQuantity: session.quantity,
            eventDate: createSessionDetails.date,
            eventLocation: createSessionDetails.location,
            eventAddress: createSessionDetails.address,
            createdBy: 1,
            sessionItemsJsonModels: (sessionFood[session.name] || []).map(food => ({
                itemId: food.itemId,
                itemDesc: food.itemDesc,
                subItemId: food.subItemId,
                createdBy: 1,
                modifiedBy: 1
            }))
        }));

        const payload = {
            eventNote: createSessionDetails.note,
            createdBy: 1,
            sessionsJsonModel,
        };

        if (value?.orderId) {
            payload.orderId = value.orderId;
        }

        console.log('payload123',payload)

        handleApiSubmit(payload);
    };

    const handleApiSubmit = async (payload) => {
        try {
            const response = await axios.post("http://localhost:8082/cater/saveCateringOrdersInfo", payload);
            toast.success('Order placed successfully!');
            setTimeout(() => navigate('/add-order'), 500);
        } catch (error) {
            console.error("Error submitting API request:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Card sx={{ padding: 3, maxWidth: { xs: '100%', sm: 600 }, margin: 'auto', marginTop: 5, boxShadow: 3 }}>
            <ToastContainer style={{ fontSize: '14px' }} />
            <h3 style={{ textAlign: 'start', color: 'gray' }}>Create Session</h3>

            {sessions.length > 0 && (
                <Tabs
                    value={selectedSession}
                    onChange={(e, newValue) => setSelectedSession(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ marginBottom: 2 }}
                >
                    {sessions.map((session, index) => (
                        <Tab key={index} label={session.name} />
                    ))}
                </Tabs>
            )}

            <form onSubmit={handleAddItem}>
                <TextField
                    label="Select Food Item"
                    value={food}
                    onChange={handleFoodChange}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                />
                {filteredFood.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, backgroundColor: '#fafafa', border: '1px solid #ddd', maxHeight: 150, overflowY: 'auto' }}>
                        {filteredFood.map((p, index) => (
                            <li key={index} style={{ padding: 8, cursor: 'pointer' }} onClick={() => selectFood(p)}>
                                {p}
                            </li>
                        ))}
                    </ul>
                )}
                <Button type="submit" variant="contained" sx={{ marginTop: 2, width: { xs: '100%', sm: '20%' } }}>
                    Add Item
                </Button>
            </form>

            {sessions.length > 0 && sessionFood[sessions[selectedSession]?.name]?.length > 0 && (
                <>
                    <TableContainer component={Paper} sx={{ marginTop: 3, overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Food Item</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessionFood[sessions[selectedSession]?.name]?.map((food, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{food.itemName}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleDelete(index)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button variant="contained" color="primary" sx={{ marginTop: 2, width: '100%' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </>
            )}
        </Card>
    );
}
