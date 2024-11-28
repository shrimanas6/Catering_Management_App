import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);


export default function AddOrder() {
    const [date, setDate] = React.useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [name, setName] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [place, setPlace] = React.useState('');
    const [food, setFood] = React.useState('')
    const [filteredPlaces, setFilteredPlaces] = React.useState([]);
    const [filteredFood, setFilteredFood] = React.useState([]);
    const [note, setNote] = React.useState('')
    const [contact, setContact] = React.useState('')
    const [quantity, setQuantity] = React.useState('')
    const [foodQuant, setFoodQuant] = React.useState([])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [morning, setMorning] = React.useState(true)
    const [afternoon, setAfternoon] = React.useState(false)
    const [night, setNight] = React.useState(false)

    console.log('filteredFood', foodQuant)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const places = ['Mangalore', 'Bangalore', 'Madantyar']

    const item = ['Dosa', 'Idli', 'Sajjige', 'Golibaje', 'Seera']

    const handlePlaceChange = (e) => {
        const input = e.target.value;
        setPlace(input);


        if (input) {
            const filtered = places.filter((p) =>
                p.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredPlaces(filtered);
        } else {
            setFilteredPlaces([]);
        }
    };
    const selectPlace = (place) => {
        setPlace(place);
        setFilteredPlaces([]);
    };

    const handleFoodChange = (e) => {
        const input = e.target.value;
        setFood(input);
        if (input) {
            const filtered = item.filter((p) =>
                p.toLowerCase().includes(input.toLowerCase())
            );
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

        if (food && quantity) {
            const now = new Date(); // Get the current date and time
            const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time as HH:mm:ss

            let period = '';
            if (morning) period = 'Morning';
            if (afternoon) period = 'Afternoon';
            if (night) period = 'Night';

            if (!period) {
                alert("Please select a time period (Morning, Afternoon, or Night).");
                return;
            }

            setFoodQuant((prev) => [
                ...prev,
                { food, quantity, time: formattedTime, period },
            ]);
            setFood(''); // Clear the food input
            setQuantity(''); // Clear the quantity input
        } else {
            alert("Please enter both food item and quantity.");
        }
    };


    const columns = [
        { id: 'food', label: 'Food Item', minWidth: 150 },
        { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'center' },
        { id: 'time', label: 'Time', minWidth: 150, align: 'right' },
        { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' },
    ];


    const handleMorn = () => {
        setMorning(!morning);
        setAfternoon(false);
        setNight(false);
    };

    const handleAfter = () => {
        setAfternoon(!afternoon);
        setMorning(false);
        setNight(false);
    };

    const handleEven = () => {
        setNight(!night);
        setMorning(false);
        setAfternoon(false);
    };

    const filteredFoodQuant = foodQuant.filter((item) => {
        if (morning && item.period === 'Morning') return true;
        if (afternoon && item.period === 'Afternoon') return true;
        if (night && item.period === 'Night') return true;
        return false;
    });

    const handleDelete = (index) => {
        setFoodQuant((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Collect all the data in a single object
        const orderData = {
            date,
            name,
            address,
            place,
            contact,
            note,
            foodItems: foodQuant,
        };

        console.log('Order Data:', orderData);
    }
    return (
        <Card className="card-cont"  >
            <div className='group-content'>
                <h3>Add Food Orders</h3>
                <div className='align-col'>
                    <div className='group inputCss'>
                    <TextField
                        required
                        id="date-input"
                        label="Function Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            marginTop: '16px',
                            backgroundColor: 'white',
                        }}
                    />
                    </div>
                   

                   <div className='group inputCss'>
                   <TextField
                        required
                        id="name-input"
                        label="Customer Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Sriman, Tejasvi"
                        variant="outlined" // Use 'outlined' or 'filled' for a modern look
                        fullWidth // Ensures the TextField takes up the full width of its container
                        sx={{
                            marginTop: '16px', // Add some spacing between elements
                            backgroundColor: 'white', // Optional for contrast against purple
                        }}
                    />
                   </div>
                   

                    <div className="group inputCss">
                        <TextField
                            required
                            id="place-input"
                            label="Function Place"
                            value={place}
                            onChange={handlePlaceChange}
                            placeholder="Start typing to search..."
                            variant="outlined"
                            fullWidth
                            sx={{
                                marginTop: '16px',
                                backgroundColor: 'white',
                            }}
                        />
                        {filteredPlaces.length > 0 && (
                            <ul className="dropdown" style={{ marginTop: '8px',zIndex : '111', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>
                                {filteredPlaces.map((p, index) => (
                                    <li
                                        key={index}
                                        onClick={() => selectPlace(p)}
                                        className="dropdown-item"
                                        style={{ cursor: 'pointer', borderBottom: filteredPlaces.length - 1 === index ? 'none' : '1px solid #eee' }}
                                    >
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>


                    <div className="group inputCss">
                        <TextField
                            required
                            id="contact-input"
                            label="Contact Number"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter 10 digits number"
                            variant="outlined"
                            fullWidth
                            inputProps={{
                                maxLength: 10, // Restricts input to 10 characters
                                pattern: "[0-9]*", // Allows only numeric input
                            }}
                            sx={{
                                marginTop: '16px',
                                backgroundColor: 'white',
                            }}
                        />
                    </div>

                </div>

                <div className="group textArea">
                    <TextField
                        required
                        id="address-input"
                        label="Address"
                        multiline
                        rows={1} // Adjust the number of visible rows
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter the complete address"
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginTop: '16px',
                            backgroundColor: 'white',
                        }}
                    />
                </div>

                <div className="group textArea">
                    <TextField
                        id="note-input"
                        label="Note"
                        multiline
                        rows={1} // Adjust the number of visible rows
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter any additional information or note"
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginTop: '16px',
                            backgroundColor: 'white',
                        }}
                    />
                </div>


                <div className='group'>
                    <h5>Order Items</h5>
                    <div className='btn-arr'>
                        <Button
                            onClick={handleMorn}
                            className={morning ? 'btn selected' : 'btn'}
                        >
                            Morning
                        </Button>
                        <Button
                            onClick={handleAfter}
                            className={afternoon ? 'btn selected' : 'btn'}
                        >
                            Afternoon
                        </Button>
                        <Button
                            onClick={handleEven}
                            className={night ? 'btn selected' : 'btn'}
                        >
                            Night
                        </Button>
                    </div>


                </div>


                <div >
                    <form className='align-colum' onSubmit={handleAddItem}>
                        <div className="group inputQ">
                            <TextField
                                id="food-input"
                                label="Select Food Item"
                                value={food}
                                onChange={handleFoodChange}
                                placeholder="Start typing to search..."
                                variant="outlined"
                                fullWidth
                                sx={{
                                    marginTop: '16px',
                                    backgroundColor: 'white',
                                }}
                            />
                            {filteredFood.length > 0 && (
                                <ul className="dropdown" style={{ marginTop: '8px',zIndex : '1111', listStyleType: 'none', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {filteredFood.map((p, index) => (
                                        <li
                                            key={index}
                                            onClick={() => selectFood(p)}
                                            style={{ cursor: 'pointer' }}
                                            className="dropdown-item"
                                        >
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="group inputQ">
                            <TextField
                                id="quantity-input"
                                label="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    marginTop: '16px',
                                    backgroundColor: 'white',
                                }}
                            />
                        </div>


                        <div className='group btn-add'>
                            <Button className='btn add-item' type='submit'>Add Item</Button>
                        </div>
                    </form>
                </div>
                <br />
                {filteredFoodQuant.length > 0 && (
                    <Paper className="paper" sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, backgroundColor: 'lightgray' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredFoodQuant
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item, index) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                {columns.map((column) => {
                                                    let value;
                                                    if (column.id === 'actions') {
                                                        value = (
                                                            <Button
                                                                onClick={() => handleDelete(index)}
                                                                color="error"
                                                                startIcon={<DeleteIcon />}
                                                            >
                                                                Delete
                                                            </Button>
                                                        );
                                                    } else {
                                                        value = item[column.id];
                                                    }
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>


                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={filteredFoodQuant.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                )}
                <br />
                <div className='btn-submit paper'>
                    <Button onClick={handleSubmit} >Submit</Button>
                </div>

            </div>
        </Card>


    );
}
