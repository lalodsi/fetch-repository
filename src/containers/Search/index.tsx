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
      const newValue = event.target.value
      if(newValue){
        setMin(parseInt(newValue));
        if (!max) return;
        if(parseInt(newValue) > max){
          setMax(parseInt(newValue));
        }
      }
    }
    const handleChangeMax: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const MaxAge = 17;
      setMax(undefined);
      const newValue = parseInt(event.target.value)
      if(newValue){
        setMax(newValue > 17 ? 17 : newValue);
        if (!min) return;
        if(newValue < min){
          setMin(newValue);
        }
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
        <div className='Search_Bar'>
        <MultiSelectionComponent
          optionsData={breads}
          onClick={handleSelectBreads}
        />

        <div className="Search_HorizontalContainer">
          <div className="Search_VerticalContainer">
            <div className="Search_HorizontalContainer">
              <label htmlFor="" className='Search_Label'>
                Age min
              </label>
              <input
                className='Search_Input'
                type="number"
                onChange={handleChangeMin}
                value={min}
                placeholder='Age Min'
                min={0}
              />
            </div>
            <div className="Search_HorizontalContainer">
              <label htmlFor="" className='Search_Label'>Age max</label>
              <input
                className='Search_Input'
                type="number"
                onChange={handleChangeMax}
                value={max}
                placeholder='Age Max'
                min={0}
              />
            </div>
          </div>
          <ButtonComponent title="Search" className='Search_Button' text='🔍' handleClick={handleClick} />
        </div>
        </div>
      </div>
    )
  }
  
  export default SearchMenu