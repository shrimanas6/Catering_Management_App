import * as React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { TextField, Grid, Container } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddOrder() {
    const location = useLocation()

    const row = location?.state?.row
    const [name, setName] = React.useState(row?row.customerName:'');
    const [address, setAddress] = React.useState(row?row.customerAddress:'');
    const [contact, setContact] = React.useState(row?row.customerMobile:'');
    const [email, setEmail] = React.useState(row?row.customerEmail:'');
    const [errors, setErrors] = React.useState({});

    const navigate = useNavigate();
    console.log('row1234',row)

    const validate = () => {
        let tempErrors = {};
        tempErrors.name = name ? "" : "Customer name is required";
        tempErrors.contact = /^[0-9]{10}$/.test(contact) ? "" : "Enter a valid 10-digit mobile number";
        tempErrors.email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ? "" : "Enter a valid email address";
        tempErrors.address = address ? "" : "Address is required";
        
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        const orderData = {
            customerName: name,
            customerMobile: contact,
            customerEmail: email,
            customerAddress: address,
        };

        try {
            await axios.post('http://localhost:8082/cater/saveCustomerInfo', orderData);
            toast.success('Order saved successfully!');
            setName('');
            setContact('');
            setEmail('');
            setAddress('');
            setErrors({});
            navigate('/create-session',{state:{row}})
        } catch (error) {
            console.error('Error saving item:', error);
            toast.error('Failed to save order');
        }
    };

    return (
        <Container maxWidth="sm"> 
            <ToastContainer style={{ fontSize: '14px' }} />
            <Card sx={{ padding: 3, mt: 4 }}>
                <h3 style={{ textAlign: 'center', marginBottom: 20 , color :'gray'}}>Add Food Orders</h3>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Customer Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Mobile Number"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            error={!!errors.contact}
                            helperText={errors.contact}
                            fullWidth
                            inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            label="Address"
                            multiline
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={!!errors.address}
                            helperText={errors.address}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Save and Continue
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
}
