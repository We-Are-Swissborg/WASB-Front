import ProtectedRoute from '@/component/Route/ProtectedRouter';
import Dashboard from '@/component/Admin/Dashboard';
import Role from '@/types/Role';
import AdminLayout from '@/component/Admin/AdminLayout';
import AdminSettings from '@/component/Admin/Settings/AdminSettings';
import AdminUsers from '@/component/Admin/Users/AdminUsers';
import AdminUserEdit from '@/component/Admin/Users/AdminUserEdit';
import AdminSetting from '@/component/Admin/Settings/AdminSetting';

const adminRoutes = 
    {
        path: 'admin',
        element: <ProtectedRoute element={<AdminLayout />} role={Role.Admin} />,
        children: [
            { index: true, element: <Dashboard /> },
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
            {
                path: 'settings/add',
                element: <AdminSetting />,
            },
            {
                path: 'settings/:id/edit',
                element: <AdminSetting />,
            },
        ],
    }
;

export default adminRoutes;