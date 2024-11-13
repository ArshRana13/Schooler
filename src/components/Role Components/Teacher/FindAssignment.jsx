import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function FindAssignment() {
  const { id } = useParams();
  const [tests, setTests] = useState(null);

  // Fetch tests data
  async function fetchTests() {
    try {
      let response = await fetch(`http://localhost:3000/schooler/teacher/getTests?id=${id}`);

      // Check if response is okay
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      let data = await response.json();
      setTests(data.tests); // Access the 'tests' array within the response object
      console.log("Fetched data: ", data.tests); // Log the fetched tests array
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  // useEffect for fetching data on component mount or when id changes
  useEffect(() => {
    fetchTests();
  }, [id]);

  return (
    <div>
      
      <div>
        {tests ? (
          <table className='min-w-full divide-y text-center divide-gray-200 border'>
            <thead className='bg-gray-50 text-center'>          
            <tr>
                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Test ID</th>
                
                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Student ID</th>
                <th className='px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>Start Evaluation</th>

            </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
            {tests.map((test) => (
              <tr>
              <td key={test.id} className='px-4 py-4 whitespace-nowrap'>
                {test.id}
              </td>
              <td key={test.id} className='px-4 py-4 whitespace-nowrap'>
                {test.student_id}
              </td>
              <td key={test.id} className='px-4 py-4 whitespace-nowrap'>
                 <button id={test.id} className='border-2 border-black p-2 hover:bg-black hover:text-white'>Start</button>
             </td>
              </tr>
            ))}
            </tbody>
          </table>
        ) : (
          <div className='flex justify-center h-screen w-screen items-center'>
            <p className='text-3xl'>No submissions yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindAssignment;
