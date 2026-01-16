import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => {
    return (
        <label
            className={`text-sm font-semibold text-[#2C2C2C] mb-2 block ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
