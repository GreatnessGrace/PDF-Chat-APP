const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Project } = require('./models/project');
const { processPDF } = require('./workers/pdfWorker');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());


app.get('/projects', async (req, res) => {
    const projects = await Project.findAll();
    res.json(projects);
});

app.get('/projects/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    res.json(project);
});

app.listen(3000, () => {
    console.log('Backend running on port 3000');
});
