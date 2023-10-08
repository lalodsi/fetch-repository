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
      const newValue = parseInt(event.target.value)
      if(newValue >= 0){
        const MaxAge = 17;
        if (!max) return;
        if (newValue > MaxAge) {
          setMin(MaxAge);
        }
        if(newValue > max){
          if (newValue > MaxAge) {
            setMax(newValue-1);
          }
          else{
            setMax(newValue);
          }
        }
      }
    }
    const handleChangeMax: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      const MaxAge = 17;
      setMax(undefined);
      const newValue = parseInt(event.target.value)
      if(newValue >= 0){
        setMax(newValue > MaxAge ? MaxAge : newValue);
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
      <div className='Search_Menu col-9 col-s-6'>
        <div className="Search_Title">
          Search in Data Base
        </div>
        <div className='Search_Bar'>
        <MultiSelectionComponent
          optionsData={breads}
          onClick={handleSelectBreads}
        />

        <div className="Search_HorizontalContainer col-">
          <div className="Search_HorizontalContainer col-6">
            <div className='Search_Label t-4 col-6 col-s-3'>
              Age min
            </div>
            <input
              className='Search_Input t-3'
              type="number"
              onChange={handleChangeMin}
              value={min}
              placeholder='Age Min'
              min={0}
            />
          </div>
          <div className="Search_HorizontalContainer col-6">
            <div className='Search_Label t-4 col-6 col-s-3'>
              Age max
            </div>
            <input
              className='Search_Input t-3'
              type="number"
              onChange={handleChangeMax}
              value={max}
              placeholder='Age Max'
              min={0}
            />
          </div>
        </div>
        <div className="Search_HorizontalContainer col-">
          <ButtonComponent title="Search" className='Search_Button' text='Search for friendly dogs 🔍' handleClick={handleClick} />
        </div>
        </div>
      </div>
    )
  }
  
  export default SearchMenu