import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddAssignment(){
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        group:'',
        title:'',
        description:'',
        score:'',
        message: ''
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/schooler/teacher/addAssignment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            console.log('Assignment created');
        } else {
            console.log('Assignment creation failed');
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
                    if (data.role == 'teacher') {
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
            <div className="flex flex-col items-center justify-center m-2">
            <span className='text-2xl font-display m-8 '>Create Assignment</span>
            <div className=' border-4 p-10 m-2 border-black flex flex-col items-center min-h-10 min-w-10 '>
            <form onSubmit={handleSubmit} className='flex flex-col items-center m-2 justify-center'>
                <select name="group" id="group" required value={formData.group} onChange={handleChange} className='m-2 text-center border-2 border-black h-10 min-w-44'>
                    <option value="" selected disabled>Select the group</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>   
                </select>
                <input value={formData.title} onChange={handleChange} required className='m-2 text-center border-2 border-black h-12 min-w-44' placeholder='Enter the title of the assignment' type="text" maxLength={20} name='title' />
                <textarea value={formData.description} onChange={handleChange} required className='m-2 text-center border-2 border-black h-40 min-w-44'  type="text" maxLength={100} name='description' placeholder='Describe this assignment' />
                <input value={formData.score} onChange={handleChange} type="number" required name="score" placeholder='Maximum score' className='m-2 text-center border-2 border-black min-h-10 min-w-fit' id="" />
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

export default AddAssignment;