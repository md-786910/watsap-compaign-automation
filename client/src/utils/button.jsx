import React from "react";
import { Save } from "lucide-react";
import { RotatingSquare } from "react-loader-spinner";

const Button = ({
    text = "Save",
    onClick,
    isLoading = false,
    Icon = Save,
    loadingText = "Loading...",
    className = "",
    ...rest
}) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 disabled:opacity-80 disabled:cursor-not-allowed ${className}`}
            {...rest}
        >
            {isLoading ? (
                <span className="flex items-center font-semibold opacity-100">
                    <RotatingSquare
                        visible={true}
                        height={28}
                        width={28}
                        color="#4fa94d"
                        ariaLabel="loading"
                    />
                    {loadingText}
                </span>
            ) : (
                <>
                    <Icon className="w-5 h-5 mr-2" />
                    {text}
                </>
            )}
        </button>
    );
};

// Correct export statement
export default Button;
