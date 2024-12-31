import './App.scss';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from './contexts/LoadingContext.tsx';
import Loading from './component/Loading.tsx';
import mainRouter from './routes/router.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import adminRoutes from './routes/adminRoutes.tsx';
import { WalletContextProvider } from './contexts/WalletContextProvider.tsx';

const router = createHashRouter([mainRouter, adminRoutes]);

const LoadingOverlay: React.FC = () => {
    const { isLoading } = useLoading();
    return isLoading ? <Loading /> : null;
};

function App() {
    return (
        <>
            <WalletContextProvider>
                <AuthProvider>
                    <LoadingProvider>
                        <ToastContainer />
                        <RouterProvider router={router} />
                        <LoadingOverlay />
                    </LoadingProvider>
                </AuthProvider>
            </WalletContextProvider>
        </>
    );
}

export default App;
