import React from 'react'
import "./styles.css"

interface ResultProps{
  handleClick : () => void
  value: string,
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
      <div className='Result_Text'>{value}</div>
    </div>
  )
}

export default Result