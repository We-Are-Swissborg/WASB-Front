import { getParameters } from '@/administration/services/parameterAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { useAuth } from '@/contexts/AuthContext';
import { Parameter } from '@/types/Parameter';
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

export default function AdminSettings() {
    const { token } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<Parameter[]>(() => []);

    const initParameters = useCallback(async () => {
        if (token) {
            const parameters = await getParameters(token);
            setData(parameters);
        }
    }, [token]);

    useEffect(() => {
        initParameters();
    }, [initParameters]);

    const columnHelper = createColumnHelper<Parameter>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns = useMemo<ColumnDef<Parameter, any>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'code',
                cell: (info) => info.getValue(),
                header: () => <span>Code</span>,
            },
            {
                accessorKey: 'name',
                cell: (info) => info.getValue(),
                header: () => <span>Name</span>,
            },
            {
                accessorKey: 'value',
                cell: (info) => info.getValue(),
                header: () => <span>Value</span>,
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
                <h1 className="h2">Paramètres</h1>
                <NavLink className={`btn btn-sm btn-primary`} to={`add`}>
                    <AddCircleSharp />
                </NavLink>
            </div>
            <TableReact table={table} />
        </>
    );
}
