import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button className={`mt-4 font-semibold rounded-md py-3 px-6 text-lg md:text-xl
                from-pink-400 to-teal-400 text-white bg-gradient-to-r animate-text
                hover:from-pink-200 hover:to-teal-200 transition-colors duration-300 ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);

export default Button;