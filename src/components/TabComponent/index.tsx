import React from 'react'
import "./styles.css"
import ButtonComponent from '../ButtonComponent';

interface TabComponentProps {
    options: string[],
    current: string,
    handleClick: (menu:string) => void
}

const TabComponent: React.FC<TabComponentProps> = (props) => {
    const {
        options,
        current,
        handleClick
    } = props;

    return (
        <div className='TabComponent'>
            {
                options.map(option => {
                    if (option === current) {
                        return <ButtonComponent className='TabComponent_Button Selected' text={option} handleClick={() => handleClick(option)} />
                    }
                    return <ButtonComponent className='TabComponent_Button' text={option} handleClick={() => handleClick(option)} />
                })
            }
        </div>
    )
}

export default TabComponent