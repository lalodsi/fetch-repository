import React from "react"
import ButtonComponent from "../../components/ButtonComponent"
import "./styles.css"

interface SearchMenuProps {
    searchText: string,
    setSearchText: React.Dispatch<React.SetStateAction<string>>,
    handleSearch: () => void
}

const SearchMenu: React.FC<SearchMenuProps> = (props) => {
    const {
        searchText,
        setSearchText,
        handleSearch
    } = props;

    const handleClick = () => {
      handleSearch();
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
      if (event.key === "Enter") {
        handleClick();
      }
    }

    // Update the text to be searched every type of the user
    const handleChangeSearchText: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setSearchText(event.target.value);
    }

    return (
      <div className='Search_Menu'>
        Search in Data Base
        <div className='Search_Bar'>
          <input
            className='Search_Input'
            type="search"
            id="query"
            onKeyDown={handleKeyDown}
            onChange={handleChangeSearchText}
            value={searchText}
            placeholder='Write a text to search'
          />
          <ButtonComponent title="Search" className='Search_Button' text='🔍' handleClick={handleClick} />
        </div>
      </div>
    )
  }
  
  export default SearchMenu