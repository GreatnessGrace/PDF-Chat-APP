import { useQuery } from 'react-query';
import axios from 'axios';

const fetchProjects = async () => {
    const { data } = await axios.get('http://localhost:3001/projects');
    return data;
};
export default function Projects() {
    const { data, error, isLoading } = useQuery('projects', fetchProjects);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading projects,{error.message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Projects</h1>
            {data.map(project => (
                <div key={project.id}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <p>Status: {project.status}</p>
                </div>
            ))}
        </div>
    );
}

// import { useQuery } from 'react-query';
// import axios from 'axios';

// const fetchProjects = async () => {
//     const { data } = await axios.get('http://localhost:3000/projects');
//     return data;
// };

// export default function Projects() {
//     const { data, error, isLoading } = useQuery('projects', fetchProjects);

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error loading projects</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold">Projects</h1>
//             {data.map(project => (
//                 <div key={project.id}>
//                     <h2>{project.title}</h2>
//                     <p>{project.description}</p>
//                     <p>Status: {project.status}</p>
//                 </div>
//             ))}
//         </div>
//     );
// }
