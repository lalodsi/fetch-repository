import React from 'react'
import "./styles.css"
import Result from './Result';
import { Dog } from '../../types/Dog';
import ButtonComponent from '../../components/ButtonComponent';
import { DogsSearchProps } from '../../types/DogsSearch';
import { Location } from '../../types/Location';

interface ResultsComponentProps {
  clickHandler: (data: {index: number, dog: Dog}) => void,
  results: DogsSearchProps | undefined
  options: Dog[],
  locations: Location[]
  handleNext: () => void,
  handlePrev: () => void,
  selectedDogs: Dog[]
}

const ResultsComponent: React.FC<ResultsComponentProps> = (props) => {
  const {
    clickHandler,
    options,
    locations,
    results,
    handleNext,
    handlePrev,
    selectedDogs
  } = props;

  console.log(results);
  console.log(locations);
  const selectedDogsIDs = selectedDogs.map(dog => dog.id)

  return (
    <>
      <div className='ResultBox col-10 col-s-8'>
        {
          options.map((option: Dog, index: number) => {
            const data = {
              index,
              dog: option,
            }
            return (
              <Result
                key={index}
                selected={selectedDogsIDs.includes(option.id)}
                value={option}
                location={locations[index]}
                handleClick={() => clickHandler(data)}
              />
            )
          })
        }
      </div>
      <div className='ResultBox_ShowMore col-8 col-s-8'>
        {
          results?.prev &&
          <ButtonComponent text='prev' handleClick={handlePrev} />
        }
        {
          results?.next &&
          <ButtonComponent text='next' handleClick={handleNext} />
        }
      </div>
    </>
  )
}

export default ResultsComponent