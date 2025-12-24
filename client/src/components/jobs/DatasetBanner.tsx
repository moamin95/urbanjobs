import { Database, Calendar, Tag, User, Globe, Info } from 'lucide-react';

export interface DatasetBannerProps {
    count: number
}

export const DatasetBanner = ({count}: DatasetBannerProps) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 border border-blue-200/50 rounded-2xl p-6 mb-10 shadow-sm">
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <Database className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 google-sans-flex">
                                NYC Jobs Dataset
                            </h2>
                            <p className="text-sm text-neutral-600 google-sans-flex">
                                Dataset ID: <span className="font-mono text-blue-700">kpav-sd4t</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-medium text-green-800 google-sans-flex">
                            {count.toLocaleString()} Rows
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-neutral-700 google-sans-flex leading-relaxed">
                            This dataset contains current job postings available on the City of New York's official jobs <a className="text-blue-700 hover:underline" target="_blank" href="http://www.nyc.gov/html/careers/html/search/search.shtml">site</a>
                            . Internal postings available to city
                            employees and external postings available to the general public are included.
                        </p>
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* Source */}
                    <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-3.5 h-3.5 text-neutral-500" />
                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Source</p>
                        </div>
                        <a className="text-xs text-neutral-900 font-mono hover:text-blue-700 font-semibold truncate" href="https://opendata.cityofnewyork.us/" target='_blank'>
                            data.cityofnewyork.us
                        </a>
                    </div>

                    {/* Category */}
                    <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Tag className="w-3.5 h-3.5 text-neutral-500" />
                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Category</p>
                        </div>
                        <p className="text-xs text-neutral-900 google-sans-flex font-semibold">
                            City Government
                        </p>
                    </div>

                    {/* Owner */}
                    <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <User className="w-3.5 h-3.5 text-neutral-500" />
                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Owner</p>
                        </div>
                        <p className="text-xs text-neutral-900 google-sans-flex font-semibold">
                            NYC OpenData
                        </p>
                    </div>

                    {/* Last Updated */}
                    <div className="bg-white/60 border border-neutral-200/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                            <p className="text-xs text-neutral-500 google-sans-flex font-medium uppercase tracking-wider">Updated</p>
                        </div>
                        <p className="text-xs text-neutral-900 google-sans-flex font-semibold">
                            Dec 23, 2025
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-auto-columns-max md:grid-flow-col md:justify-start gap-3 pt-2 border-t border-neutral-200/50">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 google-sans-flex">
                        <span className="font-medium text-neutral-500">Created:</span>
                        <span>April 18, 2013</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-neutral-600 google-sans-flex">
                        <span className="font-medium text-neutral-500">Attribution:</span>
                        <span>Department of Citywide Administrative Services (DCAS)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 google-sans-flex">
                        <span className="font-medium text-neutral-500">Endpoint:</span>
                        <span className="font-mono">v3.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
