import { getAllPosts } from '@/administration/services/postAdmin.service';
import RowActions from '@/component/Table/RowActions';
import TableReact from '@/component/Table/TableReact';
import { UseAuth } from '@/contexts/AuthContext';
import { getLanguagesFromPosts } from '@/services/translation.service';
import { PostFormData } from '@/types/Post';
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

export default function AdminPosts() {
    const { token, setToken } = UseAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<PostFormData[]>(() => []);

    const initPosts = useCallback(async () => {
        if (token) {
            const posts = await getAllPosts(token, setToken);
            setData(posts);
        }
    }, [token]);

    useEffect(() => {
        initPosts();
    }, [initPosts]);

    const columnHelper = createColumnHelper<PostFormData>();

    const columns = useMemo<ColumnDef<PostFormData>[]>(() => {
        const languages = getLanguagesFromPosts(data);

        const baseColumns: ColumnDef<PostFormData, unknown>[] = [
            {
                accessorKey: 'id',
                cell: (info) => info.getValue(),
                header: () => <span>ID</span>,
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
        ];

        const titleTranslationsColumns = languages.map((lang: string) => ({
            accessorKey: `translations.${lang}.title`,
            cell: ({ row }: { row: Row<PostFormData> }) => {
                const translation = row.original.translations?.find((t) => t.languageCode === lang);
                return translation ? translation.title : 'N/A';
            },
            header: () => <span>Titre ({lang.toUpperCase()})</span>,
        }));

        const SlugtranslationsColumns = languages.map((lang: string) => ({
            accessorKey: `translations.${lang}.slug`,
            cell: ({ row }: { row: Row<PostFormData> }) => {
                const translation = row.original.translations?.find((t) => t.languageCode === lang);
                return translation ? translation.slug : 'N/A';
            },
            header: () => <span>Slug ({lang.toUpperCase()})</span>,
        }));

        const actionsColumn: ColumnDef<PostFormData, unknown> = columnHelper.display({
            id: 'actions',
            header: () => <span>Actions</span>,
            cell: (props) => <RowActions row={props.row} />,
        });

        return [...baseColumns, ...titleTranslationsColumns, ...SlugtranslationsColumns, actionsColumn];
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
                <h1 className="h2">Posts</h1>
                <NavLink className={`btn btn-sm btn-primary`} to={`add`}>
                    <AddCircleSharp />
                </NavLink>
            </div>
            <TableReact table={table} />
        </>
    );
}
