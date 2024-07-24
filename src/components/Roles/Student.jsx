import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentImage from '../../assets/study.png';

function Student() {
    const [authenticated, setAuthenticated] = useState(false);
    const [groupStudent, setGroupStudent] = useState('');
    const [assignments, setAssignments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3000/schooler/home', {
                    credentials: 'include'  // Include credentials for CORS
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.role === 'student') {
                        setGroupStudent(data.group_student);
                        setAuthenticated(true);
                        setAssignments(data.assignments);

                        // Connect to WebSocket server
                        const socket = new WebSocket('ws://localhost:3000');

                        socket.onopen = () => {
                            console.log('WebSocket connection established');
                        };

                        socket.onmessage = (event) => {
                            const message = JSON.parse(event.data);
                            if (message.type === 'INITIAL_DATA' || message.type === 'UPDATE_ASSIGNMENTS') {
                                setAssignments(message.assignments);
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


    return (
        <div>
            {authenticated ? (
                <div className='flex m-6 p-4 flex-col items-center justify-center'>
                    <img className='max-h-60 max-w-60' src={studentImage} alt="Student" />
                    <span className='m-8 text-2xl text-center'>Welcome to Students page!</span>
                    <span className='m-8 text-4xl text-center'>Assignments</span>
                    <table className='min-w-full divide-y text-center divide-gray-200 border'>
                        <thead className='bg-gray-50 text-center'>
                            <tr>
                                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Title</th>
                                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Description</th>
                                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Score</th>
                                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Submit</th>

                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {assignments.map((assignment, index) => (
                                <tr key={index}>
                                    <td className='px-4 py-4 whitespace-nowrap'>{assignment.title}</td>
                                    <td className='px-4 py-4 whitespace-nowrap'>{assignment.description}</td>
                                    <td className='px-4 py-4 whitespace-nowrap'>{assignment.score}</td>
                                    <td className='px-4 py-4 whitespace-nowrap'>
                                        <button id={assignment.id} className='border-2 border-black p-1 hover:bg-black hover:text-white'>Submit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Checking authentication...</div>
            )}
        </div>
    );
}

export default Student;
