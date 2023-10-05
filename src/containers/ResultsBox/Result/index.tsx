import React from 'react'
import "./styles.css"
import { Dog } from '../../../types/Dog'

interface ResultProps{
  handleClick : () => void
  value: Dog,
}

const Result: React.FC<ResultProps> = (props) => {
  const {
    handleClick,
    value,
  } = props

  const toggleOptions = () => {
    handleClick()
  }
  return (
    <div className='Result' onClick={toggleOptions} >
      <img src={value.img} className='Result_Image' />
        <div className='Result_Container'>
          <div className='Result_Name'>{value.name}</div>
        </div>
        <div className='Result_Container'>
          <div className='Result_Age'>🕐{value.age} years</div>
          <div className='Result_Age'>🐶{value.breed}</div>
          <div className='Result_Age'>🏠: {value.zip_code}</div>
        </div>
      <div className='Result_Container'>
      </div>
    </div>
  )
}

export default Result