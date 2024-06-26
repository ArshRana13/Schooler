import React from 'react'

function Card({img,title,content}) {
  return (
    <div className='m-5 min-w-40 w-60 border-black border-4 min-h-40 h-96 flex flex-col items-center gap-3'>
        <img src= {img} className='object-contain mt-2 max-w-32 max-h-32'/>
        <span className='font-display text-2xl font-medium m-2'>{title}</span>
        <div className='text-lg text-center m-2'>
        {content.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  )
}

export default Card
