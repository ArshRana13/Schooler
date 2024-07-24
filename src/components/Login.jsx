import React, { useState } from 'react'
import Google from '../assets/google.png'
function Login() {
    
    const [formData, setFormData] = useState({
        password: '',
        email: '',
        message: ''
      });

      const googleAuth = async () => {
        try {
          window.location.href = await 'http://localhost:3000/auth/google';
        } catch (e) {
          console.log(e);
        }
      }

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            console.log('Login successful');
        } else {
            console.log(response);
            console.log('Login failed');
        }
    } catch (error) {
        console.log('Network error');
    }
      };

  return (
    <div className="flex flex-col items-center justify-center m-4">
        <span className='text-3xl font-display m-8 '>Login</span>
        <div className='min-w-72 min-h-96 border-4 p-10 w-1/4 h-1 m-4 border-black flex flex-col items-center'>
        <form onSubmit={handleSubmit} className='flex flex-col items-center m-3 justify-center'>
            <input type="text" name="email" value={formData.email} onChange={handleChange} id="email" placeholder='Enter your email'  className='m-2 text-center border-2 border-black min-h-10'/>
            <input type="password" name="password" id="password"  value={formData.password} onChange={handleChange} placeholder='Enter the password'  className='m-2 text-center border-2 border-black min-h-10'/>
            <button type='submit' className='w-32 p-1 m-2 border-2 border-black hover:text-white hover:bg-black'>Submit</button>
        </form>
    <span className='m-2'>Or</span>
   <button onClick={googleAuth} className='m-2 flex flex-col p-2 items-center'>
   <img src={Google} alt="" className='object-cover max-w-10 max-h-10' />
    </button> 
    
        </div>
    </div>
  )
}

export default Login
