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
import Role from '@/types/Role';
import RootLayout from '@/component/RootLayout';
import PostForm from '@/component/Form/PostForm';
import Metrics from '@/component/Metrics';
import Post from '@/component/Post';
import Event from '@/component/Event/Event';
import Session from '@/component/Event/Session';
import AboutUs from '@/component/About/AboutUs';
import ForgotPassword from '@/component/Security/ForgotPassword';

const router = {
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
            children: [
                {
                    path: '',
                    element: <Blog />,
                },
                {
                    path: 'create-post',
                    element: <ProtectedRoute element={<PostForm />} role={Role.Moderator} />,
                },
                {
                    path: ':slug',
                    element: <Post />,
                },
            ],
        },
        {
            path: 'events',
            children: [
                {
                    path: '',
                    element: <Event />,
                },
                {
                    path: ':slug',
                    element: <Session />,
                },
            ],
        },
        {
            path: 'metrics',
            children: [
                {
                    path: '',
                    element: <Metrics />,
                },
                {
                    path: ':crypto',
                    element: <Metrics />,
                },
            ],
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
            path: 'reset-password',
            element: <OnlyAnonymousRouter element={<ForgotPassword />} />,
        },
        {
            path: 'logout',
            element: <ProtectedRoute element={<Logout />} />,
        },
        {
            path: 'aboutus',
            element: <AboutUs />,
        },
    ],
};
export default router;
