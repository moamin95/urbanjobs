import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    selected,
    onChange,
    placeholder = 'Select...',
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-neutral-500 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all google-sans-flex text-left flex items-center gap-2"
            >
                {/* Icon */}
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        {icon}
                    </span>
                )}

                {/* Placeholder with count */}
                <div className="flex-1">
                    {selected.length === 0 ? (
                        <span className="text-neutral-400 text-sm">{placeholder}</span>
                    ) : (
                        <span className="text-neutral-900 text-sm">
                            {selected.length} {selected.length === 1 ? 'agency' : 'agencies'} selected
                        </span>
                    )}
                </div>

                {/* Chevron */}
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {options.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-neutral-400 google-sans-flex">
                            No options available
                        </div>
                    ) : (
                        <div className="py-2">
                            {options.map((option) => {
                                const isSelected = selected.includes(option);
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => toggleOption(option)}
                                        className={`w-full px-4 py-2.5 text-left text-sm google-sans-flex transition-colors flex items-center gap-3 ${
                                            isSelected
                                                ? 'bg-blue-50 text-blue-900 font-medium'
                                                : 'text-neutral-700 hover:bg-neutral-50'
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <div
                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                                isSelected
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'border-neutral-300'
                                            }`}
                                        >
                                            {isSelected && (
                                                <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="truncate">{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
