import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteUser() {

    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        message: ''
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/schooler/admin/deleteUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            console.log('user deleted');
        } else {
            console.log('user deletion failed');
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
        <span className='text-3xl font-display m-8 '>Delete user</span>
        <span>Note: Admin cannot delete an admin account</span>
        <div className='min-w-32 min-h-40 border-4 p-10  m-4 border-black flex flex-col items-center'>
        <form onSubmit={handleSubmit} className='flex flex-col items-center m-10 justify-center'>
            <input type="email" required name="email" value={formData.email} onChange={handleChange} id="email" placeholder='Enter user email'  className='m-2 text-center border-2 border-black min-h-10'/>
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

export default DeleteUser