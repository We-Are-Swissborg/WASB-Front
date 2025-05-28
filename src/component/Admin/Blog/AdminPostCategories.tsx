import { getPostCategories } from '@/administration/services/postCategoryAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { UseAuth } from '@/contexts/AuthContext';
import { getLanguagesFromCategories } from '@/services/translation.service';
import { PostCategoryFormData } from '@/types/PostCategory';
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
    Row,
} from '@tanstack/table-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminPostCategories() {
    const { token, setToken } = UseAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<PostCategoryFormData[]>(() => []);

    const initPostCategories = useCallback(async () => {
        if (token) {
            const categories = await getPostCategories(token, setToken);
            setData(categories);
        }
    }, [token]);

    useEffect(() => {
        initPostCategories();
    }, [initPostCategories]);

    const columnHelper = createColumnHelper<PostCategoryFormData>();

    const columns = useMemo<ColumnDef<PostCategoryFormData, unknown>[]>(() => {
        const languages = getLanguagesFromCategories(data);

        const baseColumns: ColumnDef<PostCategoryFormData, unknown>[] = [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
            },
        ];

        const translationColumns = languages.map((lang) => ({
            accessorKey: `translations.${lang}.title`,
            cell: ({ row }: { row: Row<PostCategoryFormData> }) => {
                const translation = row.original.translations?.find((t) => t.languageCode === lang);
                return translation ? translation.title : 'N/A';
            },
            header: () => <span>Nom ({lang.toUpperCase()})</span>,
        }));

        const actionsColumn: ColumnDef<PostCategoryFormData, unknown> = columnHelper.display({
            id: 'actions',
            header: () => <span>Actions</span>,
            cell: (props) => <RowActions row={props.row} />,
        });

        return [...baseColumns, ...translationColumns, actionsColumn];
    }, [data]);

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
