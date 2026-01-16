import React from 'react';
import Label from './Label';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
    const selectId = id || props.name;

    return (
        <div className="w-full flex flex-col">
            {label && (
                <Label htmlFor={selectId}>
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    className={`
                        w-full px-5 py-3.5 bg-[#F9F9F9] border-2 border-transparent rounded-xl 
                        focus:bg-white focus:border-[#B76E79]/30 focus:ring-4 focus:ring-[#B76E79]/5 
                        outline-none text-[#2C2C2C] appearance-none
                        transition-all duration-300 ease-out
                        ${error ? 'border-red-400 bg-red-50/50' : 'hover:border-[#FFE5E5]'}
                        ${className}
                    `}
                    {...props}
                >
                    <option value="" disabled>{props.placeholder || 'Select an option'}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#9E9E9E]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-xs text-red-500 font-semibold animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
