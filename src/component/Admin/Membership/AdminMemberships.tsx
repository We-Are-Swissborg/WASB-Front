import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { useAuth } from '@/contexts/AuthContext';
import { Membership } from '@/types/Membership';
import { useReactTable } from '@tanstack/react-table';
import {
    ColumnFiltersState,
    createColumnHelper,
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/table-core';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import * as MembershipService from '@/administration/services/membershipAdmin.service';

export default function AdminMemberships() {
    const { token } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [memberships, setMemberships] = useState<Membership[]>(() => []);

    const initMembershipsInProgress = useCallback(async () => {
        if (token) {
            const contributions = await MembershipService.getMemberships(token);
            setMemberships(contributions);
        }
    }, [token]);

    const initMemberships = useCallback(async () => {
        if (token) {
            const contributions = await MembershipService.getMemberships(token);
            setMemberships(contributions);
        }
    }, [token]);

    useEffect(() => {
        initMembershipsInProgress();
        initMemberships();
    }, [initMembershipsInProgress, initMemberships]);

    const columnHelper = createColumnHelper<Membership>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    const columnsInProgress = useMemo<ColumnDef<Membership, unknown>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'user',
                cell: (info) => (info.getValue() ? info.getValue().username : 'Unknow'),
                header: () => <span>User</span>,
            },
            {
                accessorKey: 'contributionStatus',
                cell: (info) => info.getValue(),
                header: () => <span>Status</span>,
            },
            {
                accessorKey: 'createdAt',
                cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
                header: () => <span>Add request</span>,
            },
            columnsHelper,
        ],
        [columnsHelper],
    );

    const columns = useMemo<ColumnDef<Membership, unknown>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'user',
                cell: (info) => (info.getValue() ? info.getValue().username : 'Unknow'),
                header: () => <span>User</span>,
            },
            {
                accessorKey: 'contributionStatus',
                cell: (info) => info.getValue(),
                header: () => <span>Status</span>,
            },
            {
                accessorKey: 'createdAt',
                cell: (info) => new Date(info.getValue()).toLocaleString('fr-FR'),
                header: () => <span>Add request</span>,
            },
            columnsHelper,
        ],
        [columnsHelper],
    );

    const tableInProgress = useReactTable({
        data: memberships,
        columns: columnsInProgress,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const table = useReactTable({
        data: memberships,
        columns: columns,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 className="h2">Membership En attente</h2>
            </div>
            <TableReact table={tableInProgress} />
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 className="h2">Membership</h2>
            </div>
            <TableReact table={table} />
        </>
    );
}
