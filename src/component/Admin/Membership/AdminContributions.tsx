import * as ContributionService from '@/administration/services/contributionsAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { useAuth } from '@/contexts/AuthContext';
import { Contribution } from '@/types/contribution';
import { AddCircleSharp } from '@mui/icons-material';
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
import { NavLink } from 'react-router-dom';

export default function AdminContributions() {
    const { token, setToken } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<Contribution[]>(() => []);

    const initContributions = useCallback(async () => {
        if (token) {
            const contributions = await ContributionService.getContributions(token, setToken);
            setData(contributions);
        }
    }, [token]);

    useEffect(() => {
        initContributions();
    }, [initContributions]);

    const columnHelper = createColumnHelper<Contribution>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    const columns = useMemo<ColumnDef<Contribution, unknown>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'title',
                cell: (info) => info.getValue(),
                header: () => <span>Title</span>,
            },
            {
                accessorKey: 'amount',
                cell: (info) => info.getValue(),
                header: () => <span>Amount</span>,
            },
            {
                accessorKey: 'duration',
                cell: (info) => info.getValue(),
                header: () => <span>Duration (mois)</span>,
            },
            {
                accessorKey: 'isActive',
                cell: (info) => (info.getValue() ? 'Oui' : 'Non'),
                header: () => <span>Is Active</span>,
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
                <h1 className="h2">Contributions</h1>
                <NavLink className={`btn btn-sm btn-primary`} to={`add`}>
                    <AddCircleSharp />
                </NavLink>
            </div>
            <TableReact table={table} />
        </>
    );
}
