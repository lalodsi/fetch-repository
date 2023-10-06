import React from 'react'

import Select, { MultiValue } from 'react-select';
import "./styles.css"

interface MultiSelectionComponentProps {
    optionsData: string[],
    onClick : (data: {
        value: string;
        label: string;
    }[]) => void
}

const MultiSelectionComponent: React.FC<MultiSelectionComponentProps> = (props) => {
    const {
        optionsData,
        onClick
    } = props;

    const groups = optionsData.map(option => {
        return {value: option, label: option}
    })

    const handleClick = (data: MultiValue<{value: string;label: string;}>) => {
        const dataChanged = data.map(dato => dato)
        onClick(dataChanged)
    }

    return (
    <Select
        isMulti
        closeMenuOnSelect={false}
        name="Breads"
        options={groups}
        onChange={handleClick}
        className="MultiSelection"
        placeholder="Select a bread"
        classNamePrefix="Select a bread"
    />
    )
}

export default MultiSelectionComponent