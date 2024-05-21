import { useQuery } from 'react-query';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';

const fetchProjects = async () => {
    const { data } = await axios.get('http://localhost:3001/projects');
    return data;
};

export default function Projects() {
    const router = useRouter();
    const { data, error, isLoading } = useQuery('projects', fetchProjects);

    if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen">Error loading projects, {error.message}</div>;

    const handleRowClick = (id) => {
        router.push(`/projects/${id}`);
    };

    return (
        <div className='items-center justify-center  bg-gray-100 p-4'>
            <div className="container mx-auto w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Projects</h1>
                <div className="grid grid-cols-8 gap-4 font-semibold mb-4 p-2 border-b border-gray-300">
                    <div className="col-span-1 text-gray-700">#</div>
                    <div className="col-span-2 text-gray-700">Title</div>
                    <div className="col-span-3 text-gray-700">Description</div>
                    <div className="col-span-2 text-gray-700">Status</div>
                </div>
                <div>
                    {data.map(project => (
                        <div 
                            key={project.id} 
                            className="grid grid-cols-8 gap-4 py-2 px-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleRowClick(project.id)}
                        >
                            <div className="col-span-1 text-gray-900">{project.id}</div>
                            <div className="col-span-2 text-gray-900">{project.title}</div>
                            <div className="col-span-3 text-gray-700 truncate">{project.description}</div>
                            <div className={`col-span-2 font-semibold ${project.status === 'created' ? 'text-green-500' : 'text-red-500'}`}>{project.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
