import { Box, Tab } from "@mui/material";
import AddOrder from "./AddOrder";
import ViewOrder from "./ViewOrder";
import { useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CreateSession from "./CreateSession";
import Session from "./Session";

function Orders() {
    
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="#fff">
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Add Orders" value="1" />
                            <Tab label="View Orders" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <AddOrder />
                    </TabPanel>
                    <TabPanel value="2">
                        <ViewOrder />
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default Orders;
