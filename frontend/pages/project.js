import { useQuery } from 'react-query';
import axios from 'axios';
import React from 'react';

const fetchProjects = async () => {
    const { data } = await axios.get('http://localhost:3001/projects');
    return data;
};

export default function Projects() {
    const { data, error, isLoading } = useQuery('projects', fetchProjects);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading projects, {error.message}</div>;

    return (
        <div className='items-center justify-center h-screen m-4'>
            <div className="container mx-auto w-full max-w-4xl p-4 border border-gray-300 m-4">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Projects</h1>
                <div className="grid grid-cols-8 gap-2 font-semibold mb-2">
                    <div className="col-span-1">#</div>
                    <div className="col-span-2">Title</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-2">Status</div>
                </div>
                <div>
                    {data.map(project => (
                        <div key={project.id} className="grid grid-cols-8 gap-2 border-t py-2">
                            <div className="col-span-1">{project.id}</div>
                            <div className="col-span-2">{project.title}</div>

<div className="col-span-3">{project.description}</div>
                            <div className="col-span-2">{project.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}