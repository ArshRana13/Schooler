import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

async function fetchDetails(id) {
    let response = await fetch(`http://localhost:3000/schooler/student/getDetails?id=${id}`);
    let data = await response.json();
    return data;
}

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function StartAssignment() {
    const { id } = useParams();
    const navigate = useNavigate(); // useNavigate inside component
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [secs, setSecs] = useState(0);
    const [totalQ, setTotalQ] = useState(0);
    const [totalS, setTotalS] = useState(0);
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        async function getDetails() {
            try {
                let details = await fetchDetails(id);
                setTitle(details.data.title);
                setDescription(details.data.description);
                setHours(details.data.timeLimit.hours);
                setMins(details.data.timeLimit.mins);
                setSecs(details.data.timeLimit.secs);
                setTotalQ(details.data.totalQuestions);
                setTotalS(details.data.totalAnswers);
                setDeadline(details.data.deadline);
            } catch (error) {
                console.error("Failed to fetch assignment details", error);
            }
        }

        getDetails();
    }, [id]);

    const startTest = () => {
        navigate(`/schooler/student/assignment/start/${id}`);
    };

    return (
        <div className='flex flex-col'>
            <div className='h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>Title: {title}</div>
            <div className='h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>Description: {description}</div>
            <div className='flex justify-between items-center'>
                <div className='h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>Total Questions: {totalQ}</div>
                <div className='h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>Time Limit: {hours} hours(s) {mins} min(s) {secs} sec(s)</div>
            </div>
            <div className='flex justify-between items-center'>
                <div className='h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>Total Score: {totalS}</div>
                <div className='h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>Deadline: {formatDate(deadline)}</div>
            </div>
            <div className='flex flex-col h-fit m-6 p-4 bg-gray-200 font-display rounded-lg'>
                Instructions: <br /> 
                <span className='p-1'>1. <span className='font-bold'>Stay in Full Screen Mode: </span>The exam will automatically switch to full screen. Do not exit full screen mode, or you will receive a warning.</span><br />
                <span className='p-1'>2. <span className='font-bold'>No Tab Switching: </span>Avoid switching between browser tabs or windows. Multiple tab switches may result in automatic submission or disqualification.</span><br />
                <span className='p-1'>3. <span className='font-bold'>Time Limit: </span>The exam is timed. Ensure you manage your time effectively, as the test will auto-submit when the timer runs out.</span><br />
                <span className='p-1'>4. <span className='font-bold'>No Outside Help: </span>You are not allowed to consult external sources, people, or devices during the exam.</span><br />
                <span className='p-1'>5. <span className='font-bold'>Report Technical Issues: </span>In case of any technical difficulties, immediately contact support through the designated support channel.</span><br />
                <span className='p-1'>6. <span className='font-bold'>Internet Stability: </span>Ensure you have a stable internet connection throughout the exam to avoid interruptions.</span>
            </div>
            <div className='flex justify-center items-center'>
                <button className='h-fit w-fit m-6 pl-14 pr-14 pt-6 pb-6 text-xl bg-gray-400 font-display rounded-lg' onClick={startTest}>
                    Start
                </button>
            </div>
        </div>
    );
}

export default StartAssignment;
