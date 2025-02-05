/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import LoadingScreen  from 'src/components/LoadingScreen';
import { auth } from 'src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserIndividual from 'src/pages/UserIndividual';
import Logout from 'src/pages/logout';
import AddStudent from 'src/sections/user/view/AddStudent';
// import UserProfile from 'src/pages/UserProfile';
// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

// const renderFallback = (
//   <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
//     <LinearProgress
//       sx={{
//         width: 1,
//         maxWidth: 320,
//         bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
//         [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
//       }}
//     />
//   </Box>
// );

// const ProtectedRoute = () => {
//   // const [user, loading] = useAuthState();

//   // if (loading) {
//   //   return <LoadingScreen />;
//   // }

//   // if (!user) {
//   //   return <Navigate to="/login" replace />;
//   // }

//   // return <Outlet />;
//   const user = auth.currentUser; // Check if the user is authenticated
  
//     if (!user) {
//       {console.log("user does not exist")}
//       // If the user is not authenticated, redirect to the login page
//       return <Navigate to="/login" />;
//     }
  
//     // If the user is authenticated, render the child routes
//     return <Outlet />;
// };

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface AuthRouteProps {
  children: JSX.Element; // 
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user1) => {
      setUser(user1);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  if (isLoading) {
    return <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >

      <LoadingScreen />;
    </Box> 
  }

  return user ? children : <Navigate to="/login" />;
};

// Auth Route Component (for login/signup pages)
const AuthRoute : React.FC<AuthRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState();

  if (loading) {
    return  <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export function Router() {
  return useRoutes([
    {
      path:'/',
      element: (
            <ProtectedRoute>
        <DashboardLayout>
            {/* <Suspense fallback={<LoadingScreen/>}> */}
              <Outlet />
            {/* </Suspense> */}
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        // { element: <HomePage />, index: true },
        {  element: <UserPage />,index:true },
        { path: 'students/:id', element: <UserIndividual /> },
        { path: 'students/add', element:<AddStudent/>},
        
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/',
      element: (
        <AuthLayout>
            <AuthRoute>
            {/* <Suspense fallback={<LoadingScreen/>}> */}
              <Outlet />
            {/* </Suspense> */}
        </AuthRoute>
          </AuthLayout>
      ),
      children: [
        { path: 'login', element: <SignInPage /> },
        {path:'logout',element:<Logout/>}
        // Add other auth routes here (signup, etc)
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

// Add this custom hook for Firebase auth state
const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return [user, loading];
};