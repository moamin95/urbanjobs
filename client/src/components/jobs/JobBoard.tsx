import React, { useEffect, useState, useRef } from 'react';
import { Search, Filter, MapPin, Briefcase, Clock, ChevronLeft, ChevronRight, DollarSign, Calendar, Building2, Users, Tag, X, ArrowRight } from 'lucide-react';
import type { Job } from '../../../../shared/types/job';
import { useJobsQuery } from '@/hooks/useJobsQuery';
import { useDebounce } from '@/hooks/useDebounce';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { DatasetBanner } from './DatasetBanner';
import { useAgencies } from '@/hooks/useAgencies';
import { MultiSelect } from '@/components/ui/MultiSelect';

export const JobBoard = () => {

    const headerRef = useRef<HTMLDivElement>(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [jobSearch, setJobSearch] = useState('');
    const [keyWordsSearch, setKeyWordsSearch] = useState('');
    const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const lastFocusedElementRef = React.useRef<HTMLDivElement | null>(null);
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
            <div ref={headerRef} className="max-w-7xl mx-auto px-6 pt-8 pb-12 lg:pt-12 lg:pb-16">
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
                                tabIndex={0}
                                onClick={(e) => {
                                    lastFocusedElementRef.current = e.currentTarget;
                                    setSelectedJob(job);
                                    setIsSheetOpen(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        lastFocusedElementRef.current = e.currentTarget;
                                        setSelectedJob(job);
                                        setIsSheetOpen(true);
                                    }
                                }}
                                className="group bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 border border-blue-200/50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 cursor-pointer"
                            >
                                <div className="space-y-5">
                                    {/* Header: Title and Job ID */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-neutral-900 google-sans-flex leading-tight group-hover:text-blue-900 transition-colors mb-2">
                                                {job.business_title}
                                            </h3>
                                            {job.civil_service_title && (
                                                <p className="text-sm text-neutral-600 google-sans-flex">
                                                    {job.civil_service_title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full flex-shrink-0">
                                            <span className="text-xs font-medium text-blue-800 google-sans-flex">
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
                                    <div className="bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-neutral-500" />
                                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Salary Range</p>
                                        </div>
                                        <p className="text-lg text-neutral-900 google-sans-flex font-bold">
                                            {formatSalary(job.salary_range_from, job.salary_range_to, job.salary_frequency)}
                                        </p>
                                    </div>

                                    {/* Footer: Job Category Badge and Apply Button */}
                                    <div className="flex items-center justify-between pt-4 border-t border-blue-200/30">
                                        {/* Job Category Badge */}
                                        {job.job_category ? (
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                                                <span className="text-xs px-3 py-1 bg-white/60 border border-neutral-200/50 text-neutral-700 rounded-lg google-sans-flex font-medium">
                                                    {job.job_category}
                                                </span>
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}

                                        {/* Apply Button */}
                                        <a
                                            onClick={(e) => { e.stopPropagation() }}
                                            href={`https://cityjobs.nyc.gov/jobs?q=${job.job_id}&options=&page=1`}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold google-sans-flex shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                            disabled={pageNumber === 1}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all google-sans-flex font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-600 google-sans-flex">
                                Page <span className="font-semibold text-neutral-900">{pageNumber}</span> of{' '}
                                <span className="font-semibold text-neutral-900">{totalPages}</span>
                            </span>
                        </div>

                        <button
                            onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
                            disabled={pageNumber === totalPages}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all google-sans-flex font-medium"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Job Details Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                    setIsSheetOpen(open);
                    if (!open && lastFocusedElementRef.current) {
                        // Restore focus after a brief delay to ensure the sheet is fully closed
                        setTimeout(() => {
                            lastFocusedElementRef.current?.focus();
                        }, 100);
                    }
                }}>
                    <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                        {selectedJob && (
                            <>
                                <SheetHeader className="space-y-4 pb-6 border-b border-neutral-200">
                                    <SheetTitle className="text-2xl lg:text-3xl font-light text-neutral-900 playfair-display tracking-tight pr-8">
                                        {selectedJob.business_title}
                                    </SheetTitle>
                                    <SheetDescription className="text-base text-neutral-600 google-sans-flex">
                                        {selectedJob.agency}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="space-y-8 py-6">
                                    {/* Key Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Salary */}
                                        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                                            <DollarSign className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Salary Range</p>
                                                <p className="text-sm text-neutral-900 google-sans-flex font-semibold">
                                                    {formatSalary(selectedJob.salary_range_from, selectedJob.salary_range_to, selectedJob.salary_frequency)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {selectedJob.work_location && (
                                            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                                                <MapPin className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Location</p>
                                                    <p className="text-sm text-neutral-900 google-sans-flex">{selectedJob.work_location}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Job Type */}
                                        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                                            <Briefcase className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Employment Type</p>
                                                <p className="text-sm text-neutral-900 google-sans-flex">{selectedJob.full_time_part_time_indicator || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        {/* Posting Date */}
                                        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                                            <Calendar className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Posted</p>
                                                <p className="text-sm text-neutral-900 google-sans-flex">{formatDate(selectedJob.posting_date)}</p>
                                            </div>
                                        </div>

                                        {/* Career Level */}
                                        {selectedJob.career_level && (
                                            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                                                <Users className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Career Level</p>
                                                    <p className="text-sm text-neutral-900 google-sans-flex">{selectedJob.career_level}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Number of Positions */}
                                        {selectedJob.number_of_positions && (
                                            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                                                <Building2 className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Positions Available</p>
                                                    <p className="text-sm text-neutral-900 google-sans-flex">{selectedJob.number_of_positions}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Job Category */}
                                    {selectedJob.job_category && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Category</h3>
                                            <p className="text-neutral-700 google-sans-flex bg-neutral-50 px-4 py-2 rounded-lg inline-block">
                                                {selectedJob.job_category}
                                            </p>
                                        </div>
                                    )}

                                    {/* Job Description */}
                                    {selectedJob.job_description && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Job Description</h3>
                                            <div className="prose prose-sm max-w-none text-neutral-700 google-sans-flex whitespace-pre-wrap leading-relaxed">
                                                {selectedJob.job_description}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Information */}
                                    {selectedJob.additional_information && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Additional Information</h3>
                                            <div className="prose prose-sm max-w-none text-neutral-700 google-sans-flex whitespace-pre-wrap leading-relaxed">
                                                {selectedJob.additional_information}
                                            </div>
                                        </div>
                                    )}

                                    {/* How to Apply */}
                                    {selectedJob.to_apply && (
                                        <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <h3 className="text-sm font-semibold text-blue-900 google-sans-flex uppercase tracking-wider">How to Apply</h3>
                                            <div className="prose prose-sm max-w-none text-blue-800 google-sans-flex whitespace-pre-wrap leading-relaxed">
                                                {selectedJob.to_apply}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Details */}
                                    <div className="space-y-3 border-t border-neutral-200 pt-6">
                                        <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Additional Details</h3>
                                        <div className="grid grid-cols-1 gap-3 text-sm">
                                            {selectedJob.civil_service_title && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Civil Service Title</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{selectedJob.civil_service_title}</span>
                                                </div>
                                            )}
                                            {selectedJob.title_classification && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Title Classification</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{selectedJob.title_classification}</span>
                                                </div>
                                            )}
                                            {selectedJob.level && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Level</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{selectedJob.level}</span>
                                                </div>
                                            )}
                                            {selectedJob.division_work_unit && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Division/Work Unit</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{selectedJob.division_work_unit}</span>
                                                </div>
                                            )}
                                            {selectedJob.posting_type && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Posting Type</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{selectedJob.posting_type}</span>
                                                </div>
                                            )}
                                            {selectedJob.residency_requirement && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Residency Requirement</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{selectedJob.residency_requirement}</span>
                                                </div>
                                            )}
                                            {selectedJob.post_until && (
                                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                                    <span className="text-neutral-500 google-sans-flex">Post Until</span>
                                                    <span className="text-neutral-900 google-sans-flex font-medium text-right">{formatDate(selectedJob.post_until)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};
