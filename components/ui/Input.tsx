import React from 'react';
import Label from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
    const inputId = id || props.name;

    return (
        <div className="w-full flex flex-col">
            {label && (
                <Label htmlFor={inputId}>
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <input
                id={inputId}
                className={`
                    w-full px-5 py-3.5 bg-[#F9F9F9] border-2 border-transparent rounded-xl 
                    focus:bg-white focus:border-[#B76E79]/30 focus:ring-4 focus:ring-[#B76E79]/5 
                    outline-none text-[#2C2C2C] placeholder:text-[#9E9E9E] 
                    transition-all duration-300 ease-out
                    ${error ? 'border-red-400 bg-red-50/50' : 'hover:border-[#FFE5E5]'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-2 text-xs text-red-500 font-semibold animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
