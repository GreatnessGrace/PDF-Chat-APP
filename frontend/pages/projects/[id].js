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
    const { data, error, isLoading } = useQuery(['project', id], () => fetchProject(id
    ));

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    
    const handleAsk = async () => {
        const { data } = await axios.post(`http://localhost:3000/projects/${id}/ask`, { question });
        setAnswer(data.answer);
    };
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading project</div>;
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p>{data.description}</p>
            <p>Status: {data.status}</p>
    
            {data.status === 'created' && (
                <div>
                    <input
                        type="text"
                        placeholder="Ask a question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button onClick={handleAsk}>Ask</button>
                    {answer && <p>Answer: {answer}</p>}
                </div>
            )}
        </div>
    );
}    