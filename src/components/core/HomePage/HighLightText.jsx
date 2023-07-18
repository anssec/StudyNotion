import React from 'react'

const HighLightText = ({text}) => {
  return (
    <span className=' font-bold text-gradient-to-b from-blue-300'>
        {" "}
        {text}
    </span>
  )
}

export default HighLightText;