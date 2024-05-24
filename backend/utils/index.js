const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

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
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs'); // Ensure correct path

    
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
    }
// console.log("text",text)
    return text;
};




const generateEmbeddings = async (text) => {
    try {
        text = ' OBJECTIVE Experienced Software Engineer specializing in fullstack development utilizing Node.js and Angular with a proven track record, actively seeking opportunities to contribute expertise and further advance my career in the realm ofsoftware development.'
        let retries = 3;
        while (retries > 0) {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
                {
                    inputs: text,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.AI_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 503) {
                console.log(`Model is loading. Retrying in 10 seconds... (Retries left: ${retries})`);
                retries -= 1;
                await new Promise(res => setTimeout(res, 10000));
            } else {
                return response.data;
            }
        }
    } catch (error) {
        console.error("Error generating embeddings:", error.response ? error.response.data : error.message);
    }
    return null;
};




module.exports = { uploadToS3, extractTextFromPDF, generateEmbeddings };
