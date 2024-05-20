const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false // Optional, can be helpful to disable the ready check for faster start
});

const queueName = 'pdf-processing';
const pdfQueue = new Queue(queueName, { connection });

// Function to add jobs to the queue
const processPDF = async projectId => {
    await pdfQueue.add('process-pdf', { projectId });
};

module.exports = { processPDF };
