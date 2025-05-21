import {
    ColumnDef,
    ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '@/types/User';
import { useAuth } from '@/contexts/AuthContext';
import RowActions from '@/component/Table/RowActions';
import Role from '@/types/Role';
import { getUsers } from '@/administration/services/userAdmin.service';
import TableReact from '@/component/Table/TableReact';

export default function AdminUsers() {
    const { token, setToken } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<User[]>(() => []);

    const initUser = useCallback(async () => {
        if (token) {
            const users = await getUsers(token, setToken);
            setData(users);
        }
    }, [token]);

    useEffect(() => {
        initUser();
    }, [initUser]);

    const columnHelper = createColumnHelper<User>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<User, any>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'username',
                cell: (info) => info.getValue(),
                header: () => <span>Username</span>,
            },
            {
                accessorKey: 'email',
                cell: (info) => info.getValue(),
                header: () => <span>Email</span>,
            },
            {
                accessorFn: (row) => `${row.firstName || ''} ${row.lastName || ''}`,
                id: 'fullName',
                header: 'Full Name',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                cell: (info) =>
                    info.getValue().map((role: Role) => (
                        <span key={role} className="badge text-bg-info">
                            {role}
                        </span>
                    )),
                enableColumnFilter: false,
            },
            {
                accessorKey: 'lastLogin',
                header: 'Last login',
                cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
                enableColumnFilter: false,
            },
            columnsHelper,
        ],
        [columnsHelper],
    );

    const table = useReactTable({
        data,
        columns,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    });

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Users</h1>
            </div>
            <TableReact table={table} />
        </>
    );
}
