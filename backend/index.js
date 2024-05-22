const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Project } = require('./models');
const { processPDF } = require('./workers/pdfWorker');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const cors = require('cors');

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

        const configuration = new Configuration({
            apiKey: process.env.OPEN_AI_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const completionResponse = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: question,
            max_tokens: 150,
        });

        const answer = completionResponse.data.choices[0].text.trim();

        res.json({ answer });
    } catch (error) {
        console.error('Error generating answer:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error generating answer' });
    }
});


app.listen(3001, () => {
    console.log('Backend running on port 3001');
});
