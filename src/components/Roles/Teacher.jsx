import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import teacher from '../../assets/teacher (1).png'
function Teacher() {
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

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
                <>          
                      <div className='flex m-6 p-4 flex-col items-center justify-center'>
                        <img className='max-h-60 max-w-60' src={teacher} alt="" />
                        <span className='m-8 text-2xl text-center'>Welcome to Teachers page!</span>
                        <div className='flex p-8 m-8 gap-8'>
                            <Link to='/schooler/teacher/addAssignment' className='text-lg border-2 border-black p-2 text-center font-medium hover:bg-black hover:text-white'>➕Create Assignment</Link>
                            <Link to="/schooler/teacher/allAssignments" className='text-lg border-2 border-black p-2 text-center font-medium hover:bg-black hover:text-white'>👁️All Assignments</Link>
                        </div>
                      </div>
                </>

            ) : (
                <div>Checking authentication...</div>
            )}
        </div>
    );
}

export default Teacher;