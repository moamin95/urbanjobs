import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { SearchInput } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import { useJobsQuery } from "../../hooks/useJobsQuery"
import { useState } from 'react'
import { columns } from './Columns'
import { useDebounce } from "@/hooks/useDebounce"

export const DataTable = () => {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(50)
    const [searchQuery, setSearchQuery] = useState("");
    const { debouncedQuery } = useDebounce({ delay: 500, query: searchQuery })
    const [sortConfig, setSortConfig] = useState({})

    const { data: jobs, totalCount, isLoading, isError, isFetching } = useJobsQuery({
        pageNumber: page,
        pageSize: itemsPerPage,
        searchQuery: debouncedQuery
    })

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    const table = useReactTable({
        data: jobs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
    });

    return (
        <div className="p-6 flex flex-col gap-4 h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl text-gray-900">Jobs Posting in NYC</h1>
                    <p className="text-sm text-gray-500 mt-1">Explore {totalCount.toLocaleString()} open positions</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
                <SearchInput
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery("")}
                    className="flex-1 max-w-md"
                />

                <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-row items-center gap-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Rows:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {[10, 50, 100].map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>

                    <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                        {page * itemsPerPage - itemsPerPage + 1} - {Math.min(itemsPerPage * page, totalCount)} of {totalCount.toLocaleString()}
                    </span>

                    <div className="flex flex-row items-center gap-2">
                        <Button
                            onClick={() => setPage(prev => prev - 1)}
                            disabled={page === 1 || isFetching}
                            variant="outline"
                            className="h-9"
                        >
                            {isFetching ? 'Loading...' : 'Previous'}
                        </Button>
                        <Button
                            disabled={isFetching || page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            variant="outline"
                            className="h-9"
                        >
                            {isFetching ? 'Loading...' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: header.getSize() }}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }} className="truncate max-w-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}