import { Box, Button, Snackbar, Stack } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from 'src/config/firebase';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Group as GroupIcon,
  Bloodtype as BloodtypeIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const Logout = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('Logged out successfully!');
      setOpen(true);
      setTimeout(()=>{
        navigate("/")
      },2000)
      
    } catch (error) {
      setMessage('Error logging out. Please try again.');
      setOpen(true);
    }
  };

  return (
    <Stack spacing={5} >
      <Button   size='small'
                
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                // sx={{ mt: 2 }}
                sx={{
    padding: '4px 8px',
    alignSelf:'flex-start',
    fontSize: '1rem',
//     maxWidth: '10vw',
  }}
                onClick={() => navigate('/')}
              >
                Back
              </Button>

      <Box component="section" textAlign="center" fontSize="2rem" sx={{ p: 2, border: '0px dashed grey'}}>
            Are You Sure For Logout ??
    </Box>
      <Button variant="contained" color="secondary" onClick={handleLogout}
        sx={{padding:'1vw 2vw'}}
      >
        Logout
      </Button>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </Stack>
  );
};
export default Logout;