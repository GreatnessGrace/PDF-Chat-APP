import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useState } from 'react';

const fetchProject = async (id) => {
    const { data } = await axios.get(`http://localhost:3001/projects/${id}`);
    return data;
};

export default function Project() {
    const router = useRouter();
    const { id } = router.query;
    const { data, error, isLoading } = useQuery(['project', id], () => fetchProject(id));

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleAsk = async () => {
        const { data } = await axios.post(`http://localhost:3001/projects/${id}/ask`, { question });
        setAnswer(data.answer);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading project</div>;

    return (
        <div className='flex items-center justify-center bg-gray-100 p-4'>
            <div className="container mx-auto w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Ask me Anything?</h1>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold flex items-center justify-center m-2">Title: {data.title}</h1>
                    <p className='flex items-center justify-center m-2'>Description: {data.description}</p>
                    <p className={`flex items-center justify-center m-2 col-span-2 font-semibold ${data.status === 'created' ? 'text-green-500' : 'text-red-500'}`}>Status: {data.status}</p>

                    {data.status === 'created' && (
                        <div className='mb-4 flex items-center'>
                            <input
                                className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                                type="text"
                                placeholder="Ask a question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                            <button
                                className='ml-2 mt-1 p-2 py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800'
                                onClick={handleAsk}
                            >
                                Ask
                            </button>
                        </div>
                    )}
                    {answer && <p className='mt-4'>Answer: {answer}</p>}
                </div>
            </div>
        </div>
    );
}
