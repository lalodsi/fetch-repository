import React from "react"
import ButtonComponent from "../../components/ButtonComponent"
import "./styles.css"
import MultiSelectionComponent from '../../components/MultiselectionComponent';

interface SearchMenuProps {
    breads: string[],
    min: number | undefined,
    max: number | undefined,
    setMin: React.Dispatch<React.SetStateAction<number | undefined>>,
    setMax: React.Dispatch<React.SetStateAction<number | undefined>>,
    setBreadsSelection: React.Dispatch<React.SetStateAction<string[]>>,
    handleSearch: () => void
}

const SearchMenu: React.FC<SearchMenuProps> = (props) => {
    const {
        min,
        max,
        breads,
        setMin,
        setMax,
        setBreadsSelection,
        handleSearch
    } = props;

    const handleClick = () => {
      handleSearch();
    }

    // Update the text to be searched every type of the user
    const handleChangeMin: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setMin(undefined);
      if(event.target.value){
        setMin(parseInt(event.target.value));
      }
    }
    const handleChangeMax: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setMax(undefined);
      if(event.target.value){
        setMax(parseInt(event.target.value));
      }
    }

    const handleSelectBreads = (data: {value: string;label: string;}[]) => {
      console.log(data);
      const destructured = data.map(bread => bread.value);
      setBreadsSelection(destructured)
    }

    return (
      <div className='Search_Menu'>
        Search in Data Base
        <MultiSelectionComponent
            optionsData={breads}
            onClick={handleSelectBreads}
          />
        <div className='Search_Bar'>
          <input
            className='Search_Input'
            type="number"
            onChange={handleChangeMin}
            value={min}
            placeholder='Age Min'
          />
          <input
            className='Search_Input'
            type="number"
            onChange={handleChangeMax}
            value={max}
            placeholder='Age Max'
          />
          <ButtonComponent title="Search" className='Search_Button' text='🔍' handleClick={handleClick} />
        </div>
      </div>
    )
  }
  
  export default SearchMenu