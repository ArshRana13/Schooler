import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import admin from '../../assets/setting.png';
import { Link } from 'react-router-dom';
function Admin() {
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
                <>          
                      <div className='flex m-6 p-4 flex-col items-center justify-center'>
                        <img className='max-h-60 max-w-60' src={admin} alt="" />
                        <span className='m-8 text-2xl text-center'>Welcome to Admin page!</span>
                      </div>

                      <div className='m-2 p-3 flex flex-col gap-10 items-center justify-center md:flex-row'>
                        <Link to='/schooler/admin/createUser' className='text-lg border-2 border-black p-2 text-center font-medium hover:bg-black hover:text-white'>
                            ➕ Create user
                        </Link>
                        <Link to='/schooler/admin/deleteUser' className='text-lg border-2 border-black p-2 text-center font-medium hover:bg-black hover:text-white'>
                            ➖ Remove user
                        </Link>
                        <button className='text-lg border-2 border-black p-2 text-center font-medium hover:bg-black hover:text-white'>
                            🔍 View user details
                        </button>
                      </div>
                </>


                


            ) : (
                <div>Checking authentication...</div>
            )}
        </div>
    );
}

export default Admin;
