const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const Analysis = require('../models/Analysis');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;

    // Paths for Python script
    const pythonExecutable = path.resolve(__dirname, '..', '..', 'venv', 'Scripts', 'python.exe');
    const scriptPath = path.resolve(__dirname, '..', '..', 'main.py');

    try {
        // Spawn python process
        const pythonProcess = spawn(pythonExecutable, [scriptPath, imagePath]);

        let pythonOutput = '';
        let pythonError = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
            console.error(`Python stderr: ${data.toString()}`);
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                return res.status(500).json({ error: 'Error processing image', details: pythonError });
            }

            try {
                // Parse the printed JSON output from python (we expect clean JSON at the end)
                // Find the FIRST '{' and LAST '}' to extract raw JSON since there could be warnings
                const jsonStart = pythonOutput.indexOf('{');
                const jsonEnd = pythonOutput.lastIndexOf('}');

                if (jsonStart === -1 || jsonEnd === -1) {
                    throw new Error("No JSON found in python output");
                }

                const jsonStr = pythonOutput.substring(jsonStart, jsonEnd + 1);
                const result = JSON.parse(jsonStr);

                if (result.error) {
                    return res.status(500).json({ error: result.error });
                }

                // Save to Database
                const newAnalysis = new Analysis({
                    healthScore: result.healthScore,
                    scoreMessage: result.scoreMessage,
                    ingredients: result.ingredients,
                    allergens: result.allergens,
                    analysis: result.analysis,
                    detailedAnalysis: result.detailedAnalysis,
                    imagePath: imagePath
                });

                await newAnalysis.save();

                // Send exactly what frontend expects (same shape)
                return res.json({
                    id: newAnalysis._id,
                    ...result
                });

            } catch (err) {
                console.error('Failed to parse python response:', err, 'Raw Output:', pythonOutput);
                return res.status(500).json({ error: 'Failed to parse AI response' });
            }
        });

    } catch (err) {
        console.error('Server error during analysis:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
