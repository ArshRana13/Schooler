import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateUser() {

    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        role:'',
        group:'',
        message: ''
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/schooler/admin/createUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            console.log('user created');
        } else {
            console.log('user creation failed');
        }
    } catch (error) {
        console.log('Network error');
    }
      };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/schooler/home', {
                    credentials: 'include'  // Include credentials for CORS
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.role == 'admin') {
                        setAuthenticated(true);
                    } 
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                // Handle specific errors if needed
            }
        };

        checkAuth();
    }, [navigate]);
  return (
    <div>
      {authenticated ? (
        <div className="flex flex-col items-center justify-center m-4">
        <span className='text-3xl font-display m-8 '>Create user</span>
        <div className='min-w-72 min-h-96 border-4 p-10 w-1/4 h-1 m-4 border-black flex flex-col items-center'>
        <form onSubmit={handleSubmit} className='flex flex-col items-center m-10 justify-center'>
            <input type="email" required name="email" value={formData.email} onChange={handleChange} id="email" placeholder='Enter user email'  className='m-2 text-center border-2 border-black min-h-10'/>
            <select name="role" id="role" required  value={formData.role} onChange={handleChange} className='m-6 text-center border-2 border-black min-h-10'>
                <option value="" selected disabled>Select the user role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>   
            </select>
            <select name="group" id="group"  value={formData.group} onChange={handleChange} className='m-2 text-center border-2 border-black min-h-10'>
                <option value="" selected disabled>Select the student group</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>   
            </select>
            <button type='submit' className='w-32 p-1 m-2 border-2 border-black hover:text-white hover:bg-black'>Submit</button>
        </form>
        </div>
    </div>
      )
      :<div>Loading...</div>
      }
    </div>
  )
}

export default CreateUser
