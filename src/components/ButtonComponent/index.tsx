import React from 'react';
import "./styles.css"

interface ButtonComponentProps {
    handleClick: () => void,
    handleDclick ?:(txt: string) => void,
    text: string,
    className?: string,
    title?: string
}

const ButtonComponent: React.FC<ButtonComponentProps> = (props) => {
    const {
        text,
        handleClick,
        className,
        title
    } = props

    return (
        <button title =  {title ? title : "TBD" } className={className ? className : "ButtonComponent"} onClick={handleClick}>
            {text}
        </button>
    )
}

export default ButtonComponent;