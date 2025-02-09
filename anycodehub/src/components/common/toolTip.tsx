import React from 'react'


const ToolTip = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='c-tooltip absolute'>
            {children}
        </div>
    )
}

export default ToolTip