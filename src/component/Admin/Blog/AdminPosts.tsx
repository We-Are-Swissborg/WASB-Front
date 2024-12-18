import { getAllPosts } from '@/administration/services/postAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types/Post';
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

export default function AdminPosts() {
    const { token } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<Post[]>(() => []);

    const initPosts = useCallback(async () => {
        if (token) {
            const posts = await getAllPosts(token);
            setData(posts);
        }
    }, [token]);

    useEffect(() => {
        initPosts();
    }, [initPosts]);

    const columnHelper = createColumnHelper<Post>();
    const columnsHelper = columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
    });

    const columns = useMemo<ColumnDef<Post>[]>(
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
                accessorKey: 'isPublish',
                cell: (info) => (info.getValue() ? 'Oui' : 'Non'),
                header: () => <span>Est Pulibé ?</span>,
            },
            {
                accessorKey: 'publishedAt',
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
                header: () => <span>Publié le</span>,
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
                <h1 className="h2">Posts</h1>
                <NavLink className={`btn btn-sm btn-primary`} to={`add`}>
                    <AddCircleSharp />
                </NavLink>
            </div>
            <TableReact table={table} />
        </>
    );
}
