import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSideBar from './AdminSideBar';

function AdminLayout() {
    return (
        <>
            <AdminHeader />
            <div className="container-fluid">
                <div className="row">
                    <AdminSideBar />
                    <main className='class="col-md-9 ms-sm-auto col-lg-10 px-md-4"'>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;
