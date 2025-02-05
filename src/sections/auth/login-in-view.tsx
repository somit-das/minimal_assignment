import React, { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db,auth,googleAuthProvider } from 'src/config/firebase';
import { signInWithEmailAndPassword,createUserWithEmailAndPassword,signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Alert, Button, Snackbar, SnackbarCloseReason } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';


import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function LoginInView() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cnfpassword, cnfSetPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const[login,setLogin] = useState(true)
  const [errMesg,setErrMesg] = useState("");
  // const handleSignIn = useCallback(() => {
  //   router.push('/');
  // }, [router]);
  useEffect(()=>{
    if(auth.currentUser){
      // console.log(auth.currentUser);
      navigate("/");
    }
  })
 const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setErrMesg("")
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setPersistence(auth,browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password);
      
      // {console.log(auth.currentUser)}
      
      // const idToken = await auth.currentUser?.getIdToken();
      // localStorage.setItem('idToken', idToken);

      // const refreshToken = auth.currentUser?.refreshToken;
      // localStorage.setItem('refreshToken', refreshToken);

      // const uid = auth.currentUser?.uid;
      // localStorage.setItem('uid', uid);

      // setPersistence, browserLocalPersistence, browserSessionPersistence

      if (auth.currentUser) {
        // console.log(auth.currentUser); // Debug check
        navigate("/");
      }
    } catch (err: any) {
      setErrMesg(()=>err.message)
      setOpen(()=>true)
    }
  };
  const handleSignUp = async(e:React.FormEvent)=>{
    e.preventDefault();
    if(cnfpassword===password){
      try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const {user} = userCredential;
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
            });
            // toast("helloworld");
            // navigate('/login');
            console.log(userCredential);
            setErrMesg(()=>"Account Created Succesfully")
            setOpen(()=>true)
            setLogin(()=>true)
        }
        catch(err){
          // console.log(err.message);
          if(err.message.includes("auth/invalid-email")){
          setErrMesg(()=>"Invalid Email")
          }else if(err.message.includes("auth/missing")){
            setErrMesg(()=>"Fields May Be Missing")
          
          }else if(err.message.includes("auth/email-already-in-use")){
            setErrMesg(()=>"Email Already In Use")
          
          }
            setOpen(() => true)
            console.log("Error",err);
        }
    }else{
      setErrMesg(()=>"Password are Not Same")
      setOpen(()=>true)
    }
  
  }
  const signInWithGoogle = async () => {
       try {
         await signInWithPopup(auth,googleAuthProvider)
         setErrMesg(()=>"Successful Logging")
         setOpen(()=>true)
         setTimeout(()=>{
        navigate("/")
      },2000)
       } catch (err) {
         console.log('Error', err);
       }
  };
  const loginForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        // defaultValue="admin@123.com"
        defaultValue=""
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        // defaultValue="admin@123"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

    {/* {console.log(email,cnfpassword,password)} */}
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleLogin}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  const signupForm = (
     <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue=""
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }}
      />

      {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}

        <TextField
        fullWidth
        name="confirmpassword"
        label="Confirm Password"
        defaultValue=""
        InputLabelProps={{ shrink: true }}
        type={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        // defaultValue="admin@123"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    cnfSetPassword(event.target.value);
  }}
        sx={{ mb: 3 }}
      />
    {/* {console.log(email,cnfpassword,password)} */}
      

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignUp}
      >
        Sign UP
      </LoadingButton>
    </Box>
  )

  const directSign = (
    <Box gap={1} display="flex" justifyContent="center" alignItems="center">
        Sign with Google
        <IconButton color="inherit" onClick={signInWithGoogle}>
          <Iconify icon="logos:google-icon" />
        </IconButton>
        {/* <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton> */}
      </Box>
  );

  return login? (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={()=>setLogin(false)}>
            Get started
          </Link>
        </Typography>
      </Box>

      {loginForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>
      {directSign}
      {/* <Toaster/> */}
     <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={errMesg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  ):<>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign UP</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={()=>setLogin(true)}>
            Get Login
          </Link>
        </Typography>
      </Box>

      {signupForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      {directSign}
      {/* {console.log("open "+open)} */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={errMesg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
;
}
