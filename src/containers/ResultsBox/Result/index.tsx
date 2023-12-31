import React from 'react'
import "./styles.css"
import { Dog } from '../../../types/Dog'
import { Location } from '../../../types/Location'

interface ResultProps{
  handleClick : () => void
  value: Dog,
  location?: Location,
  selected: boolean,
  className?: string
}

const Result: React.FC<ResultProps> = (props) => {
  const {
    handleClick,
    value,
    location,
    selected,
    className
  } = props

  const toggleOptions = () => {
    handleClick()
  }

  const classText =
    className ?
      className
      :
      selected ?
        "Result_Selected col-4 col-s-3"
        :
        "Result col-4 col-s-3"

  return (
    <div className={classText} onClick={toggleOptions} >
      <div className='Result_Heart'>{selected? "❤️":"🤍"}</div>
      <div className='Result_BoxContainer'>
        <img src={value.img} className='Result_Image' />
        <div className='Result_Container'>
          <div className='Result_Name'>{value.name}</div>
        </div>
        <div className='Result_Container'>
          <div className='Result_Age'>🕐{value.age} years</div>
          <div className='Result_Age'>🐶{value.breed}</div>
          {
            location &&
            <div className='Result_Age'>🏠{`${location.county}, ${location.state}, ${location.city}`}</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Result