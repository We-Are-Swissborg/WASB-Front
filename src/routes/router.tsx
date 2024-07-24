import { createHashRouter } from 'react-router-dom';
import Root from './root';
import ErrorPage from '../hook/Error-page';
import Home from '../component/Home';
import Blog from '../component/Blog';
import Contact from '../component/Contact';
import ProtectedRoute from '../component/Route/ProtectedRouter';
import Profile from '../component/Profile';
import Register from '../component/Security/Register';
import Login from '../component/Security/Login';
import Logout from '../component/Security/Logout';
import OnlyAnonymousRouter from '../component/Route/OnlyAnonymousRouter';

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
                element: <Blog />,
            },
            {
                path: '/contact',
                element: <Contact />,
            },
            {
                path: '/register',
                element: <OnlyAnonymousRouter element={<Register />} />,
                children: [
                    {
                        path: ':codeRef',
                        element: <OnlyAnonymousRouter element={<Register />} />,
                    },
                ],
            },
            {
                path: '/profile',
                element: <ProtectedRoute element={<Profile />} />,
            },
            {
                path: '/login',
                element: <OnlyAnonymousRouter element={<Login />} />,
            },
            {
                path: '/logout',
                element: <ProtectedRoute element={<Logout />} />,
            },
        ],
    },
]);

export default router;
