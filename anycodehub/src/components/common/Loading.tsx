import React from 'react';

interface LoadingProps {
    fullScreen?: boolean;
    text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text = "Processing..." }) => {
    const overlayClasses = fullScreen
        ? "fixed inset-0 z-50"
        : "absolute inset-0";

    return (
        <div className={`${overlayClasses} bg-black/70 backdrop-blur-sm flex items-center justify-center`}>
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/30 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <span className="text-white text-xl font-medium tracking-wider">{text}</span>
            </div>
        </div>
    );
};

export default Loading; 