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
import { useState, useEffect, useMemo } from 'react';
import * as MembershipService from '@/administration/services/membershipAdmin.service';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';

const fetcherMemberships: (token: string) => Promise<Membership[]> = (token) => MembershipService.getMemberships(token);

export default function AdminMemberships() {
    const { t } = useTranslation('global');
    const { token } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [membershipsInProgress, setMembershipsInProgress] = useState<Membership[]>(() => []);
    const [membershipsOther, setMembershipsOther] = useState<Membership[]>(() => []);

    const { data: memberships, error: membershipsError, isLoading } = useSWR<Membership[]>('memberships', () => fetcherMemberships(token!));

    useEffect(() => {
        if(memberships && memberships.length > 0) {
            setMembershipsInProgress(memberships.filter(m => m.contributionStatus === 'in progress'));
            setMembershipsOther(memberships.filter(m => m.contributionStatus !== 'in progress'));
        }
    }, [memberships]);

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
        data: membershipsInProgress,
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
        data: membershipsOther,
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

    if (membershipsError) return <div>{t('blog.loading-error')}</div>;

    if (isLoading) return <div>{t('common.loading')}</div>;

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
