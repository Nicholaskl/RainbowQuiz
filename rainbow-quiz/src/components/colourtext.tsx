import React from 'react';

// Corrected: Use HTMLAttributes for an H1 element
type ColourTextProps = React.HTMLAttributes<HTMLHeadingElement>;

const ColourText: React.FC<ColourTextProps> = ({ children, className, ...props }) => (
    <h1 className={`font-bold text-center 
                bg-gradient-to-r from-pink-400 to-teal-400
                text-transparent bg-clip-text animate-text ${className || ''}`}
        {...props}
    >
        {children}
    </h1>
);

export default ColourText;
