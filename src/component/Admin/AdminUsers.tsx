/* eslint-disable no-unused-vars */
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    RowData,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { InputHTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '../../types/User';
import { getUsers } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import RowActions from '../Table/RowActions';
import Role from '../../types/Role';

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select';
    }
}

function Filter({ column }: { column: Column<User, unknown> }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};
    const sortedUniqueValues = useMemo(
        () =>
            filterVariant === 'range' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [column.getFacetedUniqueValues(), filterVariant],
    );

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                {/* See faceted column filters example for min max values functionality */}
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select onChange={(e) => column.setFilterValue(e.target.value)} value={columnFilterValue?.toString()}>
            {/* See faceted column filters example for dynamic select options */}
            <option value="">All</option>
            {sortedUniqueValues.map((value) => (
                //dynamically generated select options from faceted values feature
                <option value={value} key={value}>
                    {value}
                </option>
            ))}
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
        // See faceted column filters example for datalist search suggestions
    );
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, debounce, onChange]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

export default function AdminUsers() {
    const { token } = useAuth();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<User[]>(() => []);

    const initUser = useCallback(async () => {
        if (token) {
            const users = await getUsers(token);
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
                cell: (info) => info.getValue().map((role: Role) => <span key={role} className="badge text-bg-info">{role}</span>),
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
        [],
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
        getFacetedRowModel: getFacetedRowModel(), // client-side faceting
        getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    });

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Users</h1>
            </div>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
