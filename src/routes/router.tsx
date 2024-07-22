import { createHashRouter } from 'react-router-dom';
import Root from './root';
import ErrorPage from '../hook/Error-page';
import Home from '../component/Home';
import Blog from '../component/Blog';
import Contact from '../component/Contact';
import Register from '../component/Register';
import ProtectedRoute from '../component/ProtectedRouter';
import Profile from '../component/Profile';
import Login from '../component/Login';

const router = createHashRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: '/blog',
                element: <ProtectedRoute element={<Blog />} />,
            },
            {
                path: '/contact',
                element: <Contact />,
            },
            {
                path: '/register',
                element: <Register />,
                children: [
                    {
                        path: ':codeRef',
                        element: <Register />,
                    },
                ],
            },
            {
                path: '/profile',
                element: <ProtectedRoute element={<Profile />} />,
            },
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
]);

export default router;
