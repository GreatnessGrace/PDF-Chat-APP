const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const uploadToS3 = async (filePath, fileName) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
    };

    const data = await s3.upload(params).promise();
    return data.Location;
};

const extractTextFromPDF = async (pdfPath) => {
    const pdfjsLib = await import('pdfjs-dist');
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
    }

    return text;
};

const generateEmbeddings = async (text) => {
    const response = await axios.post('YOUR_LLM_API_URL', { text });
    return response.data.embeddings;
};

module.exports = { uploadToS3, extractTextFromPDF, generateEmbeddings };
