import './App.scss';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Root from './routes/root.tsx';
import ErrorPage from './hook/Error-page.tsx';
import Blog from './component/Blog.tsx';
import Home from './component/Home.tsx';
import Contact from './component/Contact.tsx';
import Register from './component/Register.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext.tsx';
import Loading from './component/Loading.tsx';
import Profile from './component/Profile.tsx';
import Login from './component/Login.tsx';

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
                element: <Register />,
                children: [
                    {
                        path: ':codeRef',
                        element: <Register />,
                    }
                ]

            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
]);

const LoadingOverlay: React.FC = () => {
    const { isLoading } = useLoading();
    return isLoading ? <Loading /> : null;
};

function App() {
    return (
        <>
            <LoadingProvider>
                <ToastContainer />
                <RouterProvider router={router} />
                <LoadingOverlay />
            </LoadingProvider>
        </>
    );
}

export default App;
