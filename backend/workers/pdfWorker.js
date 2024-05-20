const { Worker, Queue, QueueScheduler } = require('bullmq');
const IORedis = require('ioredis');
const { Project } = require('../models');
const { uploadToS3, extractTextFromPDF, generateEmbeddings } = require('../utils/index.js');

const connection = new IORedis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false // Optional, can be helpful to disable the ready check for faster start
});

const queueName = 'pdf-processing';

// Create a new Queue Scheduler (optional but recommended)
// const queueScheduler = new QueueScheduler(queueName, { connection });

// Create a new Worker
const pdfWorker = new Worker(queueName, async job => {
    const project = await Project.findByPk(job.data.projectId);

    try {
        const text = await extractTextFromPDF(project.pdfUrl);
        const embeddings = await generateEmbeddings(text);

        project.embedding = embeddings;
        project.status = 'created';
        await project.save();
    } catch (error) {
        project.status = 'failed';
        await project.save();
    }
}, { connection });

// Function to add jobs to the queue
const processPDF = async projectId => {
    const queue = new Queue(queueName, { connection });
    await queue.add('process-pdf', { projectId });
};

module.exports = { processPDF };
