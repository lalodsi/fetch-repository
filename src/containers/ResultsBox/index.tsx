import React from 'react'
import "./styles.css"
import Result from './Result';

interface ResultsComponentProps {
  clickHandler: () => void,
  options: string[]
}

const ResultsComponent: React.FC<ResultsComponentProps> = (props) => {
  const {
    clickHandler,
    options
  } = props;

  const [optionsQuantity, setOptionsQuantity] = React.useState(3 > options.length? options.length : 3)

  const optionsSize = options.length;

  const handleShowMoreOptions = () => {
    const numberOfElementsToAdd = 5;

    if (optionsSize < optionsQuantity) {
      setOptionsQuantity(0)
    }

    if ((optionsQuantity + numberOfElementsToAdd) >= optionsSize) {
      setOptionsQuantity(optionsSize)
    }
    setOptionsQuantity(optionsQuantity + numberOfElementsToAdd)
  }



  return (
    <div className='ResultBox'>
      {
        options.map((option: string, index: number) => {
          if (index < optionsQuantity) {
            console.log(option);
              return (
                <Result
                  key={index}
                  value={option}
                  handleClick={clickHandler}
                />
              )
          }
        })
      }
      {
        (optionsSize - optionsQuantity > 0)?
        <div className='ResultBox_ShowMore' onClick={handleShowMoreOptions}>{`Show More Options (${optionsSize - optionsQuantity})`}</div>
        :
        <div className='ResultBox_ShowMore' onClick={() => null}>{`There's no more options`}</div>

      }
    </div>
  )
}

export default ResultsComponent