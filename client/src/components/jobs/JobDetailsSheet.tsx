import React from 'react';
import { DollarSign, MapPin, Briefcase, Calendar, Users, Building2 } from 'lucide-react';
import type { Job } from '../../../../shared/types/job';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface JobDetailsSheetProps {
    job: Job | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lastFocusedElementRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const JobDetailsSheet: React.FC<JobDetailsSheetProps> = ({
    job,
    isOpen,
    onOpenChange,
    lastFocusedElementRef,
}) => {
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
        <Sheet open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open && lastFocusedElementRef.current) {
                setTimeout(() => {
                    lastFocusedElementRef.current?.focus();
                }, 100);
            }
        }}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white">
                {job && (
                    <>
                        <SheetHeader className="space-y-4 pb-6 border-b border-blue-200/50">
                            <SheetTitle className="text-2xl lg:text-3xl font-light text-neutral-900 playfair-display tracking-tight pr-8">
                                {job.business_title}
                            </SheetTitle>
                            <SheetDescription className="text-base text-neutral-600 google-sans-flex font-medium">
                                {job.agency}
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-8 py-6">
                            {/* Key Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Salary */}
                                <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
                                    <DollarSign className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Salary Range</p>
                                        <p className="text-sm text-neutral-900 google-sans-flex font-semibold">
                                            {formatSalary(job.salary_range_from, job.salary_range_to, job.salary_frequency)}
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                {job.work_location && (
                                    <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Location</p>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold">{job.work_location}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Job Type */}
                                <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
                                    <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Employment Type</p>
                                        <p className="text-sm text-neutral-900 google-sans-flex font-semibold">{job.full_time_part_time_indicator || 'Not specified'}</p>
                                    </div>
                                </div>

                                {/* Posting Date */}
                                <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
                                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Posted</p>
                                        <p className="text-sm text-neutral-900 google-sans-flex font-semibold">{formatDate(job.posting_date)}</p>
                                    </div>
                                </div>

                                {/* Career Level */}
                                {job.career_level && (
                                    <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
                                        <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Career Level</p>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold">{job.career_level}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Number of Positions */}
                                {job.number_of_positions && (
                                    <div className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm">
                                        <Building2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider mb-1">Positions Available</p>
                                            <p className="text-sm text-neutral-900 google-sans-flex font-semibold">{job.number_of_positions}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Job Category */}
                            {job.job_category && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Category</h3>
                                    <p className="text-neutral-700 google-sans-flex bg-white/60 border border-blue-200/50 px-4 py-2 rounded-lg inline-block font-medium">
                                        {job.job_category}
                                    </p>
                                </div>
                            )}

                            {/* Job Description */}
                            {job.job_description && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Job Description</h3>
                                    <div className="prose prose-sm max-w-none text-neutral-700 google-sans-flex whitespace-pre-wrap leading-relaxed bg-white/40 border border-blue-200/30 p-5 rounded-xl">
                                        {job.job_description}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information */}
                            {job.additional_information && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Additional Information</h3>
                                    <div className="prose prose-sm max-w-none text-neutral-700 google-sans-flex whitespace-pre-wrap leading-relaxed bg-white/40 border border-blue-200/30 p-5 rounded-xl">
                                        {job.additional_information}
                                    </div>
                                </div>
                            )}

                            {/* How to Apply */}
                            {job.to_apply && (
                                <div className="space-y-3 p-5 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100/30 border border-blue-300/50 rounded-xl shadow-sm">
                                    <h3 className="text-sm font-semibold text-blue-900 google-sans-flex uppercase tracking-wider">How to Apply</h3>
                                    <div className="prose prose-sm max-w-none text-blue-800 google-sans-flex whitespace-pre-wrap leading-relaxed">
                                        {job.to_apply}
                                    </div>
                                </div>
                            )}

                            {/* Additional Details */}
                            <div className="space-y-3 border-t border-blue-200/50 pt-6">
                                <h3 className="text-sm font-semibold text-neutral-900 google-sans-flex uppercase tracking-wider">Additional Details</h3>
                                <div className="grid grid-cols-1 gap-3 text-sm bg-white/40 border border-blue-200/30 rounded-xl p-4">
                                    {job.civil_service_title && (
                                        <div className="flex justify-between py-2 border-b border-blue-100/50">
                                            <span className="text-neutral-500 google-sans-flex">Civil Service Title</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{job.civil_service_title}</span>
                                        </div>
                                    )}
                                    {job.title_classification && (
                                        <div className="flex justify-between py-2 border-b border-blue-100/50">
                                            <span className="text-neutral-500 google-sans-flex">Title Classification</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{job.title_classification}</span>
                                        </div>
                                    )}
                                    {job.level && (
                                        <div className="flex justify-between py-2 border-b border-blue-100/50">
                                            <span className="text-neutral-500 google-sans-flex">Level</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{job.level}</span>
                                        </div>
                                    )}
                                    {job.division_work_unit && (
                                        <div className="flex justify-between py-2 border-b border-blue-100/50">
                                            <span className="text-neutral-500 google-sans-flex">Division/Work Unit</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{job.division_work_unit}</span>
                                        </div>
                                    )}
                                    {job.posting_type && (
                                        <div className="flex justify-between py-2 border-b border-blue-100/50">
                                            <span className="text-neutral-500 google-sans-flex">Posting Type</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{job.posting_type}</span>
                                        </div>
                                    )}
                                    {job.residency_requirement && (
                                        <div className="flex justify-between py-2 border-b border-blue-100/50">
                                            <span className="text-neutral-500 google-sans-flex">Residency Requirement</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{job.residency_requirement}</span>
                                        </div>
                                    )}
                                    {job.post_until && (
                                        <div className="flex justify-between py-2">
                                            <span className="text-neutral-500 google-sans-flex">Post Until</span>
                                            <span className="text-neutral-900 google-sans-flex font-semibold text-right">{formatDate(job.post_until)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};
