const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Project } = require('./models/project');
const { processPDF } = require('./workers/pdfWorker');

const app = express();
const upload = multer({ dest: 'uploads/' });

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

app.listen(3001, () => {
    console.log('Backend running on port 3001');
});
