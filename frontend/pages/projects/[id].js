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

    if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-100">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen bg-gray-100">Error loading project</div>;

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
            <div className="container mx-auto w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Ask me Anything?</h1>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold text-center mb-4">Project Title: {data?.title}</h1>
                    <p className='text-center mb-4'>Project Description: {data?.description}</p>
                    <p className={`text-center mb-4 font-semibold ${data?.status === 'created' ? 'text-green-500' : 'text-red-500'}`}>Status: {data?.status}</p>

                    {data?.status === 'created' && (
                        <div className='mb-4 flex items-center justify-center'>
                            <input
                                className='mt-1 p-2 border border-gray-300 rounded-md w-full max-w-md'
                                type="text"
                                placeholder="Ask a question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                            <button
                                className='ml-2 mt-1 p-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                                onClick={handleAsk}
                            >
                                Ask
                            </button>
                        </div>
                    )}
                    {answer && <p className='mt-4 text-center'>Answer: {answer}</p>}
                </div>
            </div>
        </div>
    );
}
