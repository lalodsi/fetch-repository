import React from 'react'
import "./styles.css"
import Result from './Result';
import { Dog } from '../../types/Dog';
import ButtonComponent from '../../components/ButtonComponent';
import { DogsSearchProps } from '../../types/DogsSearch';
import { Location } from '../../types/Location';

interface ResultsComponentProps {
  clickHandler: () => void,
  results: DogsSearchProps | undefined
  options: Dog[],
  locations: Location[]
  handleNext: () => void,
  handlePrev: () => void
}

const ResultsComponent: React.FC<ResultsComponentProps> = (props) => {
  const {
    clickHandler,
    options,
    locations,
    results,
    handleNext,
    handlePrev
  } = props;

  console.log(results);
  console.log(locations);
  

  return (
    <>
      <div className='ResultBox'>
        {
          options.map((option: Dog, index: number) => {
            return (
              <Result
                key={index}
                value={option}
                location={locations[index]}
                handleClick={clickHandler}
              />
            )
          })
        }
      </div>
      <div className='ResultBox_ShowMore'>
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