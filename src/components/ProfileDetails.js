import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const ProfileDetails = () => {
  const [profile, setProfile] = React.useState({
    name: 'Rakshan',
    email: 'rakshan@example.com',
    phone: '9876543210',
    role: 'Full-Stack Developer',
    location: 'Bangalore',
  });

  const [profileImage, setProfileImage] = React.useState(
    'https://i.pravatar.cc/150?img=3' // Placeholder profile image
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('Profile saved:', profile);
    alert('Profile updated successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={4} sx={{ p: 5, width: 450, borderRadius: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={profileImage}
              sx={{ width: 100, height: 100, mb: 1 }}
            />
            <input
              accept="image/*"
              type="file"
              id="upload-photo"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-photo">
              <IconButton
                component="span"
                color="primary"
                sx={{
                  border: '1px dashed #1976d2',
                  borderRadius: 2,
                  padding: '4px 12px',
                  fontSize: '0.875rem',
                }}
              >
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Change Photo
              </IconButton>
            </label>
          </Stack>
          <Typography variant="h5" mt={2}>
            Profile Details
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Role"
          name="role"
          value={profile.role}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={profile.location}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 1.5 }}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfileDetails;
