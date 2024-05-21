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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Create a New Project</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
