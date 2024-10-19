import React from 'react'

const Button = ({ children, type, disabled, onClick, style="w-24" }) => {
    return (
        <button
            type={type}
            className={`bg-primary text-white p-2 rounded-sm ${style}`}
            onClick={onClick}
            disabled={disabled}
        >{children}</button >
    )
}

export default Button