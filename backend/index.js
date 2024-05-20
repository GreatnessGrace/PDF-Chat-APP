const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Project } = require('./models/project');
const { processPDF } = require('./workers/pdfWorker');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Backend running on port 3000');
});
