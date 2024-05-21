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
    // const pdfjsLib = await import('pdfjs-dist');
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs'); // Ensure correct path

    // console.log("pdfjsLib",pdfjsLib)
    // console.log("pdfjsLib.getDocument(pdfPath)",pdfjsLib.getDocument(pdfPath))
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

// const generateEmbeddings = async (text) => {
//     const response = await axios.post('YOUR_LLM_API_URL', { text });
//     console.log("response", response)
//     console.log("response.data", response.data)
//     console.log("response.data.embeddings", response.data.embeddings)
//     return response.data.embeddings;
// };

// const generateEmbeddings = async (text) => {
//     console.log("key-----",process.env.OPEN_AI_KEY)
//     try {
//         const response = await axios.post('https://api.openai.com/v1/embeddings', {
//             model: 'text-embedding-3-small', 
//             inputs: text,
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`, 
//                 'Content-Type': 'application/json',
//             },
//         });
//         // console.log("response.data----",response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error generating embeddings:", error.response.data);
//         throw error;
//     }
// };
const generateEmbeddings = async (text) => {
    try {
        const maskedText = text.replace(`${process.env.AI_KEY}`, '[MASK]');
        
        // Truncate or split input text if it exceeds maximum sequence length
        const truncatedText = maskedText.slice(0, 512); 
        const response = await axios.post('https://api-inference.huggingface.co/models/bert-base-uncased', {
            inputs: truncatedText,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.AI_KEY}`, 
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Caught error:", error);
        if (error.response && error.response.data && error.response.data.error === 'Model google-bert/bert-base-uncased is currently loading') {
            console.log(`Model is still loading. Estimated time: ${error.response.data.estimated_time} seconds`);
            // You can wait for the estimated time and retry the request here
            // Alternatively, you can implement a retry mechanism with exponential backoff
        } else {
            console.error("Error generating embeddings:", error.response.data);
            throw error;
        }
    }
};


module.exports = { uploadToS3, extractTextFromPDF, generateEmbeddings };
