import React,{ useEffect, useRef } from 'react'
import gsap from 'gsap'

function HomePageAnimationBar() {
    const squareRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(squareRef.current,
            {
                x:"10vw",
                y:0
            },
            {
                x:"80vw",
                duration: 4,
                yoyo: true,
                repeat:-1
            }
        )
      }, []);

  return (
    <div>
      <div ref= {squareRef} className='w-20 h-20 m-2 bg-black border rounded-xl'></div>
    </div>
  )
}

export default HomePageAnimationBar
