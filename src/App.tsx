import './App.scss';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext.tsx';
import Loading from './component/Loading.tsx';
import router from './routes/router.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

const LoadingOverlay: React.FC = () => {
    const { isLoading } = useLoading();
    return isLoading ? <Loading /> : null;
};

function App() {
    return (
        <>
            <AuthProvider>
                <LoadingProvider>
                    <ToastContainer />
                    <RouterProvider router={router} />
                    <LoadingOverlay />
                </LoadingProvider>
            </AuthProvider>
        </>
    );
}

export default App;
