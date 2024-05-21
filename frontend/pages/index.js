import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('pdf', file);

        await axios.post('http://localhost:3001/projects', formData);
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-96 p-8 border border-gray-300 rounded-xl'>
     
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Create a New Project</h1>
           
            <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label htmlFor='text' className='block text-sm font-medium text-gray-700'>Text</label>
                <input className='mt-1 p-2 border border-gray-300 rounded-md w-full' type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className='mb-4 relative'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700'>Description</label>
                <textarea className='mt-1 p-2 border border-gray-300 rounded-md w-full' placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className='mb-4 realtive'>
                    <label htmlFor='file' className='block text-sm font-medium text-gray-700'>File</label>
                <input className='mt-1 p-2 border border-gray-300 rounded-md w-full' type="file" onChange={(e) => setFile(e.target.files[0])} required />
                </div>

                <div className='flex justify-center'>
                <button type="submit" className='w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800'>Create</button>
                </div>
            </form>
            </div>
        </div>
       
    );
}
