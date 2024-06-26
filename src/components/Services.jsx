import React,{ useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';
import Card from './Card';
import Teacher from '../assets/teacher.png';
import Student from '../assets/read.png'

function Services() {

  return (
    <div className='flex  m-16 items-center flex-col gap-12 justify-center '>
        
        <span className='text-4xl font-display font-medium '>Services</span>
        
        <span className='text-center text-lg font-body font-medium'>
            At Schooler, we provide a comprehensive assignment management system for schools. Our platform streamlines the workflow for teachers and students, making it easier to assign, submit, and evaluate assignments. We aim to create a stress-free environment, allowing everyone to focus on teaching and learning.        
        </span>

<div className='md:flex gap-12'>
        <Card 
                img= {Teacher}
                title='Teachers'
                content={[
                'Teachers no longer need to check a pile of assignments as evaluations can be done online.',
                ]}
         />


        <Card
                img= {Student}
                title='Students'
                content={[
                'Students can conveniently submit assignments, request re-evaluations, and view their marks on our platform.',
                ]}
          />

            
</div>
    </div>
  )
}

export default Services
