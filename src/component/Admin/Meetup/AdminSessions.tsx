import { getAllSessions } from '@/administration/services/sessionAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@/types/Session';
import { AddCircleSharp } from '@mui/icons-material';
import { useReactTable } from '@tanstack/react-table';
import {
    ColumnDef,
    ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from '@tanstack/table-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminSessions() {
    const { token, setToken } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<Session[]>(() => []);

    const initSessions = useCallback(async () => {
        if (token) {
            const sessions = await getAllSessions(token, setToken);
            setData(sessions);
        }
    }, [token]);

    useEffect(() => {
        initSessions();
    }, [initSessions]);

    const columnHelper = createColumnHelper<Session>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    const columns = useMemo<ColumnDef<Session>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'title',
                cell: (info) => info.getValue(),
                header: () => <span>Titre</span>,
            },
            {
                accessorKey: 'slug',
                cell: (info) => info.getValue(),
                header: () => <span>Slug</span>,
            },
            {
                accessorKey: 'status',
                cell: (info) => info.getValue(),
                header: () => <span>Statut</span>,
            },
            {
                accessorKey: 'membersOnly',
                cell: (info) => (info.getValue() ? 'Oui' : 'Non'),
                header: () => <span>Members Only ?</span>,
            },
            {
                accessorKey: 'startDateTime',
                cell: (info) => {
                    const dateValue = info.getValue() as string | null;

                    if (dateValue) {
                        const date = new Date(dateValue);
                        if (!isNaN(date.getTime())) {
                            return date.toLocaleString('fr-FR');
                        }
                    }
                    return 'Non publié';
                },
                header: () => <span>Date début</span>,
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
    });

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Sessions</h1>
                <NavLink className={`btn btn-sm btn-primary`} to={`add`}>
                    <AddCircleSharp />
                </NavLink>
            </div>
            <TableReact table={table} />
        </>
    );
}
