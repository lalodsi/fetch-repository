import React from 'react'
import "./styles.css"
import Result from './Result';
import { Dog } from '../../types/Dog';
import ButtonComponent from '../../components/ButtonComponent';
import { DogsSearchProps } from '../../types/DogsSearch';

interface ResultsComponentProps {
  clickHandler: () => void,
  results: DogsSearchProps | undefined
  options: Dog[],
  handleNext: () => void,
  handlePrev: () => void
}

const ResultsComponent: React.FC<ResultsComponentProps> = (props) => {
  const {
    clickHandler,
    options,
    results,
    handleNext,
    handlePrev
  } = props;

  // const [optionsQuantity, setOptionsQuantity] = React.useState(3 > options.length? options.length : 3)

  // const optionsSize = options.length;

  // const handleShowMoreOptions = () => {
  //   const numberOfElementsToAdd = 5;

  //   if (optionsSize < optionsQuantity) {
  //     setOptionsQuantity(0)
  //   }

  //   if ((optionsQuantity + numberOfElementsToAdd) >= optionsSize) {
  //     setOptionsQuantity(optionsSize)
  //   }
  //   setOptionsQuantity(optionsQuantity + numberOfElementsToAdd)
  // }



  return (
    <div className='ResultBox'>
      {
        options.map((option: Dog, index: number) => {
          return (
            <Result
              key={index}
              value={option}
              handleClick={clickHandler}
            />
          )
        })
      }
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
      {/* {
        (optionsSize - optionsQuantity > 0)?
        <div className='ResultBox_ShowMore' onClick={handleShowMoreOptions}>{`Show More Options (${optionsSize - optionsQuantity})`}</div>
        :
        <div className='ResultBox_ShowMore' onClick={() => null}>{`There's no more options`}</div>

      } */}
    </div>
  )
}

export default ResultsComponent