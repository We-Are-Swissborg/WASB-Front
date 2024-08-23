import { createHashRouter } from 'react-router-dom';
import ErrorPage from '@/hook/Error-page';
import Home from '@/component/Home';
import Blog from '@/component/Blog';
import Contact from '@/component/Contact';
import ProtectedRoute from '@/component/Route/ProtectedRouter';
import Profile from '@/component/Profile';
import Register from '@/component/Security/Register';
import Login from '@/component/Security/Login';
import Logout from '@/component/Security/Logout';
import OnlyAnonymousRouter from '@/component/Route/OnlyAnonymousRouter';
import Dashboard from '@/component/Admin/Dashboard';
import Role from '@/types/Role';
import AdminLayout from '@/component/Admin/AdminLayout';
import RootLayout from '@/component/RootLayout';
import AdminSettings from '@/component/Admin/Settings/AdminSettings';
import AdminUsers from '@/component/Admin/Users/AdminUsers';
import AdminUserEdit from '@/component/Admin/Users/AdminUserEdit';

const router = createHashRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'blog',
                element: <Blog />,
            },
            {
                path: 'contact',
                element: <Contact />,
            },
            {
                path: 'register',
                element: <OnlyAnonymousRouter element={<Register />} />,
                children: [
                    {
                        path: ':codeRef',
                        element: <Register />,
                    },
                ],
            },
            {
                path: 'profile',
                element: <ProtectedRoute element={<Profile />} />,
            },
            {
                path: 'login',
                element: <OnlyAnonymousRouter element={<Login />} />,
            },
            {
                path: 'logout',
                element: <ProtectedRoute element={<Logout />} />,
            },
        ],
    },
    {
        path: 'admin',
        element: <ProtectedRoute element={<AdminLayout />} role={Role.Admin} />,
        children: [
            {
                path: '',
                element: <Dashboard />,
            },
            {
                path: 'users',
                element: <AdminUsers />,
            },
            {
                path: 'users/:id/edit',
                element: <AdminUserEdit />,
            },
            {
                path: 'settings',
                element: <AdminSettings />,
            },
        ],
    },
]);

export default router;
