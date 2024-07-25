import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddAssignment2() {
  const [inputFields, setInputFields] = useState([{ value: '', score: '' }]);

  const handleAddField = () => {
    setInputFields([...inputFields, { value: '', score: '' }]);
  };

  const handleRemoveField = (index) => {
    const newInputFields = inputFields.filter((field, i) => i !== index);
    setInputFields(newInputFields);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newInputFields = inputFields.map((field, i) => {
      if (i === index) {
        return { ...field, [name]: value };
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    group: '',
    title: '',
    description: '',
    hours: '',
    minutes: '',
    seconds: '',
    deadline: '',
    inputFields: [{ value: '', score: '' }]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timeLimit = {
      hours: formData.hours,
      minutes: formData.minutes,
      seconds: formData.seconds,
    };
    const submissionData = {
      ...formData,
      timeLimit,
      inputFields: inputFields
    };

    try {
      const response = await fetch('http://localhost:3000/schooler/teacher/addAssignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
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
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.role === 'teacher') {
            setAuthenticated(true);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen p-4">
      {authenticated ? (
        <div className="flex flex-col justify-center items-center">
          <div id="createAssignmentText" className="m-16 text-2xl">
            Create Assignment
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="mb-4 flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <label htmlFor="group" className="block text-gray-700">Group:</label>
                <select
                  name="group"
                  id="group"
                  required
                  value={formData.group}
                  onChange={handleChange}
                  className="m-2 text-center border-2 border-black h-10 w-2/3"
                >
                  <option value="" disabled>Select the group</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-gray-700">Time limit:</label>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    required
                    name="hours"
                    maxLength={1}
                    value={formData.hours}
                    onChange={handleChange}
                    className="m-2 text-center border-2 border-black h-10 w-full md:w-16"
                    placeholder="HH"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    name="minutes"
                    required
                    value={formData.minutes}
                    onChange={handleChange}
                    className="m-2 text-center border-2 border-black h-10 w-full md:w-16"
                    placeholder="MM"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    name="seconds"
                    required
                    value={formData.seconds}
                    onChange={handleChange}
                    className="m-2 text-center border-2 border-black h-10 w-full md:w-16"
                    placeholder="SS"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <label htmlFor="title" className="block text-gray-700">Title:</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-300 rounded"
                />
              </div>
              <div className="w-full md:w-1/2 ml-3">
                <label htmlFor="deadline" className="block text-gray-700">Deadline:</label>
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-2/4
                   p-2 border-2 border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">Description:</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border-2 border-gray-300 rounded"
                rows="4"
              />
            </div>
            <div id="questions" className="mb-4 border-4 p-10 border-gray-300 rounded-lg flex flex-col items-center overflow-auto max-h-96 w-full">
              {inputFields.map((field, index) => (
                <div key={index} className="w-full flex flex-col md:flex-row items-center mb-2">
                  <input
                    type="text"
                    name="value"
                    required
                    value={field.value}
                    onChange={(event) => handleInputChange(index, event)}
                    placeholder="Enter question"
                    className="w-full md:flex-grow p-2 border-2 border-gray-300 rounded mb-2 md:mb-0 md:mr-2"
                  />
                  <input
                    type="number"
                    name="score"
                    required
                    value={field.score}
                    onChange={(event) => handleInputChange(index, event)}
                    placeholder="Score"
                    className="w-full md:w-24 p-2 border-2 border-gray-300 rounded mb-2 md:mb-0 md:mr-2"
                  />
                  <button className="w-full md:w-auto border-2 border-black p-1 mb-2 md:mb-0 md:mr-2" type="button" onClick={() => handleRemoveField(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddField} className="bg-gray-200 text-gray-700 text-2xl p-2 rounded-full ">
                +
              </button>
            </div>
            <div className='flex justify-center items-center'>
              <button type="submit" className="w-full md:w-1/4 py-2 mt-4 bg-blue-500 text-white rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div id="loading">Loading...</div>
      )}
    </div>
  );
}

export default AddAssignment2;
