import  { useEffect, useState, useRef } from 'react';
import { Search, Filter, MapPin, Briefcase, Clock, ChevronLeft, ChevronRight, DollarSign, Users, Tag, X, ArrowRight } from 'lucide-react';
// import type { Job } from '../../../../shared/types/job';
import { useJobsQuery } from '@/hooks/useJobsQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { DatasetBanner } from './DatasetBanner';
import { useAgencies } from '@/hooks/useAgencies';
import { MultiSelect } from '@/components/ui/MultiSelect';
// import { JobDetailsSheet } from './JobDetailsSheet';

export const JobBoard = () => {

    const headerRef = useRef<HTMLDivElement>(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [jobSearch, setJobSearch] = useState('');
    const [keyWordsSearch, setKeyWordsSearch] = useState('');
    const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
    // const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    // const [isSheetOpen, setIsSheetOpen] = useState(false);
    // const lastFocusedElementRef = React.useRef<HTMLDivElement | null>(null);
    const pageSize = 12;

    const debouncedJobSearch = useDebounce({ delay: 500, query: jobSearch });
    const debouncedKeyWords = useDebounce({ delay: 500, query: keyWordsSearch });

    const { data: agencies } = useAgencies();


    useEffect(() => {
        if (pageNumber === 1) return;
        if (headerRef.current !== null) {
            headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        return;

    }, [pageNumber])

    useEffect(() => {
        setPageNumber(1);
    }, [debouncedJobSearch.debouncedQuery, debouncedKeyWords.debouncedQuery, selectedAgencies]);

    const { data: jobs, totalCount, isLoading } = useJobsQuery({
        pageNumber,
        pageSize,
        searchQuery: {
            job: debouncedJobSearch.debouncedQuery,
            keyWords: debouncedKeyWords.debouncedQuery
        },
        agencies: selectedAgencies
    });

    const totalPages = Math.ceil(totalCount / pageSize)

    const formatSalary = (from: string, to: string, frequency: string) => {
        const formatNumber = (num: string) => {
            const n = parseFloat(num);
            return isNaN(n) ? '' : `$${n.toLocaleString()}`;
        };
        const fromFormatted = formatNumber(from);
        const toFormatted = formatNumber(to);
        if (fromFormatted && toFormatted) {
            return `${fromFormatted} - ${toFormatted} ${frequency || ''}`;
        }
        return fromFormatted || toFormatted || 'Not specified';
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-slate-50/50">
            <div ref={headerRef} className="max-w-7xl mx-auto px-2 sm:px-6 pt-8 pb-12 lg:pt-12 lg:pb-16">
                {/* Dataset Banner */}
                <DatasetBanner count={totalCount} />

                {/* Search Controls */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search job titles..."
                            value={jobSearch}
                            onChange={(e) => setJobSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-500 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all google-sans-flex"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search key words..."
                            value={keyWordsSearch}
                            onChange={(e) => setKeyWordsSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-500 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all google-sans-flex"
                        />
                    </div>
                    <MultiSelect
                        options={agencies.map(agency => agency.agency)}
                        selected={selectedAgencies}
                        onChange={setSelectedAgencies}
                        placeholder="Select agencies..."
                        icon={<Briefcase className="w-5 h-5" />}
                    />
                </div>

                {/* Selected Agencies Badges */}
                {selectedAgencies.length > 0 && (
                    <div className="mb-10 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-neutral-600 google-sans-flex">
                            Filtering by:
                        </span>
                        {selectedAgencies.map((agency) => (
                            <button
                                key={agency}
                                onClick={() => setSelectedAgencies(selectedAgencies.filter(a => a !== agency))}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 border border-blue-200/50 text-blue-900 rounded-xl text-sm font-medium google-sans-flex hover:border-blue-300/60 hover:shadow-sm transition-all group"
                            >
                                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                                {agency}
                                <X className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-800 transition-colors" />
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedAgencies([])}
                            className="text-xs text-neutral-500 hover:text-neutral-700 underline google-sans-flex transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Job List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-neutral-400 google-sans-flex">Loading positions...</div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-neutral-400 google-sans-flex">No positions found</div>
                    </div>
                ) : (
                    <div className="space-y-5 mb-12">
                        {jobs.slice(0, pageSize).map((job) => (
                            <div
                                key={job[":id"]}
                                className="group bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 border border-blue-200/50 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300/60 transition-all duration-300"
                            >
                                <div className="space-y-5">
                                    {/* Header: Title and Job ID */}
                                    <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 google-sans-flex leading-tight group-hover:text-blue-900 transition-colors mb-2">
                                                {job.business_title}
                                            </h3>
                                            {job.civil_service_title && (
                                                <p className="text-sm text-neutral-600 google-sans-flex">
                                                    {job.civil_service_title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full">
                                            <span className="text-xs font-medium text-blue-800 google-sans-flex whitespace-nowrap">
                                                ID: {job.job_id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {/* Agency */}
                                        <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Agency</p>
                                            </div>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold truncate">
                                                {job.agency}
                                            </p>
                                        </div>

                                        {/* Location */}
                                        <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Location</p>
                                            </div>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold truncate">
                                                {job.work_location || 'Not specified'}
                                            </p>
                                        </div>

                                        {/* Career Level */}
                                        <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users className="w-3.5 h-3.5 text-neutral-500" />
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Level</p>
                                            </div>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold">
                                                {job.career_level || 'Unspecified'}
                                            </p>
                                        </div>

                                        {/* Posting Date */}
                                        <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Posted</p>
                                            </div>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold">
                                                {formatDate(job.posting_date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Salary Section */}
                                    <div className="bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl p-3 sm:p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-neutral-500" />
                                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Salary Range</p>
                                        </div>
                                        <p className="text-base sm:text-lg text-neutral-900 google-sans-flex font-bold break-words">
                                            {formatSalary(job.salary_range_from, job.salary_range_to, job.salary_frequency)}
                                        </p>
                                    </div>

                                    {/* Footer: Job Category Badge and Apply Button */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 border-t border-blue-200/30">
                                        {/* Job Category Badge */}
                                        {job.job_category ? (
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                                                <span className="text-xs px-3 py-1 bg-white/60 border border-neutral-200/50 text-neutral-700 rounded-lg google-sans-flex font-medium">
                                                    {job.job_category}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="hidden sm:block"></div>
                                        )}

                                        {/* Apply Button */}
                                        <a
                                            onClick={(e) => { e.stopPropagation() }}
                                            href={`https://cityjobs.nyc.gov/jobs?q=${job.job_id}&options=&page=1`}
                                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold google-sans-flex shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Apply Now
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && jobs.length > 0 && (
                    <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                        <button
                            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                            disabled={pageNumber === 1}
                            className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all google-sans-flex font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden xs:inline">Previous</span>
                        </button>

                        <div className="flex items-center gap-2 px-2">
                            <span className="text-xs sm:text-sm text-neutral-600 google-sans-flex whitespace-nowrap">
                                Page <span className="font-semibold text-neutral-900">{pageNumber}</span> of{' '}
                                <span className="font-semibold text-neutral-900">{totalPages}</span>
                            </span>
                        </div>

                        <button
                            onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
                            disabled={pageNumber === totalPages}
                            className="flex items-center gap-2 px-3 sm:px-5 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all google-sans-flex font-medium"
                        >
                            <span className="hidden xs:inline">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Job Details Sheet */}
                {/* <JobDetailsSheet
                    job={selectedJob}
                    isOpen={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    lastFocusedElementRef={lastFocusedElementRef}
                /> */}
            </div>
        </div>
    );
};
