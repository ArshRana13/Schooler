import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AllAssignments() {

    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/schooler/home', {
                    credentials: 'include'  // Include credentials for CORS
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.role === 'teacher') {

                        setAuthenticated(true);
                        setAssignments(data.assignments || []); // Ensure it's an array

                        // Connect to WebSocket server
                        const socket = new WebSocket('ws://localhost:3000');

                        socket.onopen = () => {
                            console.log('WebSocket connection established');
                        };

                        socket.onmessage = (event) => {
                            const message = JSON.parse(event.data);
                            if (message.type === 'INITIAL_DATA' || message.type === 'UPDATE_ASSIGNMENTS') {
                                setAssignments(message.assignments || []); // Ensure it's an array
                            }
                        };

                        socket.onclose = () => {
                            console.log('WebSocket connection closed');
                        };

                        // Cleanup on component unmount
                        return () => {
                            socket.close();
                        };
                    } else {
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    const startEvaulation = (id) => {
        // Add your logic here to handle the start of the assignment

        console.log('Start assignment with ID:', id);
        navigate(`evaluation/showAllAssignments/${id}`)
    };


    return (
        <div>
            {authenticated ? (
                <div className='flex m-6 p-4 flex-col items-center justify-center'>
                    <span className='m-8 text-2xl text-center'>All assignments are here!</span>
                    <span className='m-8 text-4xl text-center'>Assignments</span>
                    {assignments.length > 0 ? ( // Check if assignments exist
                        <table className='min-w-full divide-y text-center divide-gray-200 border'>
                            <thead className='bg-gray-50 text-center'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                                    <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Title</th>
                                    <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Evaluate</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {assignments.map((assignment, index) => (
                                    <tr key={index}>
                                        <td className='px-4 py-4 whitespace-nowrap'>{assignment.id}</td>
                                        <td className='px-4 py-4 whitespace-nowrap'>{assignment.title}</td>
                                        <td className='px-4 py-4 whitespace-nowrap'>
                                            <button id={assignment.id} className='border-2 border-black p-2 hover:bg-black hover:text-white' onClick={() => startEvaulation(assignment.id)}>Start</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <span>No assignments available.</span>
                    )}
                </div>
            ) : (
                <div>Checking authentication...</div>
            )}
        </div>
    );
}

export default AllAssignments;
