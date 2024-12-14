import { getPostCategories } from '@/administration/services/postCategoryAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { useAuth } from '@/contexts/AuthContext';
import { PostCategory } from '@/types/PostCategory';
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

export default function AdminPostCategories() {
    const { token } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<PostCategory[]>(() => []);

    const initPostCategories = useCallback(async () => {
        if (token) {
            const categories = await getPostCategories(token);
            setData(categories);
        }
    }, [token]);

    useEffect(() => {
        initPostCategories();
    }, [initPostCategories]);

    const columnHelper = createColumnHelper<PostCategory>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    const columns = useMemo<ColumnDef<PostCategory, unknown>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
            {
                accessorKey: 'title',
                cell: (info) => info.getValue(),
                header: () => <span>Name</span>,
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
                <h1 className="h2">Post Categories</h1>
                <NavLink className={`btn btn-sm btn-primary`} to={`add`}>
                    <AddCircleSharp />
                </NavLink>
            </div>
            <TableReact table={table} />
        </>
    );
}
