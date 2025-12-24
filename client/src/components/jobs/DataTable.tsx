import { SearchInput } from "@/components/ui/input"
import { Button } from "../ui/button"
import { useJobsQuery } from "../../hooks/useJobsQuery"
import { useState } from 'react'
import { useDebounce } from "@/hooks/useDebounce"

export const DataTable = () => {
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("");
    const { debouncedQuery } = useDebounce({ delay: 500, query: searchQuery })

    const { data: jobs, totalCount, isLoading, isError, isFetching } = useJobsQuery({
        pageNumber: page,
        pageSize: itemsPerPage,
        searchQuery: debouncedQuery
    })

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    return (
        <div className="w-full min-h-screen">
            <div className="w-full bg-[radial-gradient(182.37%_99.11%_at_99.11%_61.02%,#0047FF_23.11%,#002BAD_100%)] pt-12 pb-20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="font-black text-4xl md:text-5xl text-white tracking-tight">
                                    Jobs Posting in <span className="text-blue-200">NYC</span>
                                </h1>
                                <p className="text-blue-100/80 font-medium mt-3 flex items-center gap-2">
                                    <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse"></span>
                                    Exploring {totalCount.toLocaleString()} open positions
                                </p>
                            </div>

                            <div className="hidden lg:block text-right">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-200/60 font-bold mb-2">Current View</p>
                                <p className="text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                    {page * itemsPerPage - itemsPerPage + 1} — {Math.min(itemsPerPage * page, totalCount)}
                                    <span className="text-blue-200/60 font-normal mx-1">of</span> {totalCount.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Modern Glass Toolbar */}
                        <div className="p-3 flex flex-col lg:flex-row items-center gap-4">
                            {/* Search Inputs Group */}
                            <div className="flex flex-col sm:flex-row w-full lg:flex-1 gap-3 p-1">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search Jobs..."
                                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-blue-100/50 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="relative flex-1">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/50 z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Location..."
                                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-blue-100/50 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Controls Group */}
                            <div className="flex items-center gap-4 px-4 pb-2 lg:pb-0 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-blue-100/70 uppercase">Rows</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="bg-black/20 border border-white/10 text-white rounded-lg text-xs font-bold py-2 px-3 outline-none appearance-none cursor-pointer"
                                    >
                                        {[10, 20, 50].map((item) => <option key={item} value={item} className="text-black">{item}</option>)}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 ml-auto">
                                    <Button
                                        onClick={() => setPage(prev => prev - 1)}
                                        disabled={page === 1 || isFetching}
                                        className="h-11 px-5 bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-xl transition-all"
                                    >
                                        {isFetching ? '...' : '←'}
                                    </Button>
                                    <Button
                                        disabled={isFetching || page === totalPages}
                                        onClick={() => setPage(prev => prev + 1)}
                                        className="h-11 px-6 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all border-none"
                                    >
                                        {isFetching ? '...' : 'Next Page'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-4 h-screen">
                <div className="flex-1 space-y-4">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div
                                key={job.job_id}
                                className="relative group overflow-hidden bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Decorative subtle gradient glow (Optional) */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <div className="relative flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                                            {job.business_title}
                                        </h3>
                                        <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">
                                            {job.civil_service_title}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest text-gray-500 bg-white/50 backdrop-blur-sm border border-white/40 px-3 py-1.5 rounded-lg uppercase">
                                        Ref: {job.job_id}
                                    </span>
                                </div>

                                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="space-y-1">
                                        <p className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                            Agency
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">{job.agency}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                            Location
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">{job.work_location || 'Remote / Not specified'}</p>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-white/30 flex justify-between items-end">
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Annual Salary</p>
                                            <p className="text-lg font-black text-gray-900">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseInt(job.salary_range_from))}
                                                <span className="mx-1 text-gray-400 font-light">—</span>
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseInt(job.salary_range_to))}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 italic">
                                                Posted {new Date(job.posting_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">No results found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}