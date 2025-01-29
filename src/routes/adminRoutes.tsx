import ProtectedRoute from '@/component/Route/ProtectedRouter';
import Dashboard from '@/component/Admin/Dashboard';
import Role from '@/types/Role';
import AdminLayout from '@/component/Admin/AdminLayout';
import AdminSettings from '@/component/Admin/Settings/AdminSettings';
import AdminUsers from '@/component/Admin/Users/AdminUsers';
import AdminUserEdit from '@/component/Admin/Users/AdminUserEdit';
import AdminSetting from '@/component/Admin/Settings/AdminSetting';
import AdminPostCategory from '@/component/Admin/Blog/AdminPostCategory';
import AdminPostCategories from '@/component/Admin/Blog/AdminPostCategories';
import AdminPost from '@/component/Admin/Blog/AdminPost';
import AdminPosts from '@/component/Admin/Blog/AdminPosts';
import AdminContributions from '@/component/Admin/Membership/AdminContributions';
import AdminMemberships from '@/component/Admin/Membership/AdminMemberships';
import AdminContribution from '@/component/Admin/Membership/AdminContribution';
import AdminMembership from '@/component/Admin/Membership/AdminMembership';
import AdminSessions from '@/component/Admin/Meetup/AdminSessions';
import AdminSession from '@/component/Admin/Meetup/AdminSession';

const adminRoutes = {
    path: 'admin',
    element: <ProtectedRoute element={<AdminLayout />} role={Role.Admin} />,
    children: [
        { index: true, element: <Dashboard /> },
        {
            path: 'category',
            children: [
                {
                    path: '',
                    element: <AdminPostCategories />,
                },
                {
                    path: 'add',
                    element: <AdminPostCategory />,
                },
                {
                    path: ':id/edit',
                    element: <AdminPostCategory />,
                },
            ],
        },
        {
            path: 'contributions',
            children: [
                {
                    path: '',
                    element: <AdminContributions />,
                },
                {
                    path: 'add',
                    element: <AdminContribution />,
                },
                {
                    path: ':id/edit',
                    element: <AdminContribution />,
                },
            ],
        },
        {
            path: 'memberships',
            children: [
                {
                    path: '',
                    element: <AdminMemberships />,
                },
                {
                    path: 'add',
                    element: <AdminMembership />,
                },
                {
                    path: ':id/edit',
                    element: <AdminMembership />,
                },
            ],
        },
        {
            path: 'posts',
            children: [
                {
                    path: '',
                    element: <AdminPosts />,
                },
                {
                    path: 'add',
                    element: <AdminPost />,
                },
                {
                    path: ':id/edit',
                    element: <AdminPost />,
                },
            ],
        },
        {
            path: 'settings',
            children: [
                {
                    path: '',
                    element: <AdminSettings />,
                },
                {
                    path: 'add',
                    element: <AdminSetting />,
                },
                {
                    path: ':id/edit',
                    element: <AdminSetting />,
                },
            ],
        },
        {
            path: 'users',
            children: [
                {
                    path: '',
                    element: <AdminUsers />,
                },
                {
                    path: ':id/edit',
                    element: <AdminUserEdit />,
                },
            ],
        },
        {
            path: 'meetup',
            children: [
                {
                    path: '',
                    element: <AdminSessions />,
                },
                {
                    path: 'add',
                    element: <AdminSession />,
                },
                {
                    path: ':id/edit',
                    element: <AdminSession />,
                },
            ],
        },
    ],
};
export default adminRoutes;
