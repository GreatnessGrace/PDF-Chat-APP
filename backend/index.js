const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Project } = require('./models');
const { processPDF } = require('./workers/pdfWorker');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

app.use(bodyParser.json());

app.post('/projects', upload.single('pdf'), async (req, res) => {
    const { title, description } = req.body;
    const pdfUrl = req.file.path;
    const project = await Project.create({ title, description, pdfUrl, status: 'creating' });

    processPDF(project.id);

    res.status(201).json(project);
});

app.get('/projects', async (req, res) => {
    const projects = await Project.findAll();
    res.json(projects);
});

app.get('/projects/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    res.json(project);
});



app.post('/projects/:id/ask', async (req, res) => {
    const { id } = req.params;
    const { question } = req.body;

    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.status !== 'created') {
            return res.status(400).json({ error: 'Project is not ready for questions' });
        }
        const context = project.embedding.flat().join(' ');
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
            {
                inputs: {
                    question,
                    context
                },
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.AI_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const answer = response.data.answer || 'No answer generated';

        res.json({ answer });
    } catch (error) {
        console.error('Error generating answer:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error generating answer' });
    }
});


app.listen(3001, () => {
    console.log('Backend running on port 3001');
});
