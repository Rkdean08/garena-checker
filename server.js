const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Home route message
app.get('/', (req, res) => {
    res.send('<h1>Free Fire UID Name Checker API is Live! 🚀</h1><p>Use: /api/player?uid=YOUR_UID</p>');
});

// Main endpoint to check nickname using UID
app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    // Check if UID is missing or not provided
    if (!uid) {
        return res.json({ status: "error", message: "Please enter a valid UID!" });
    }

    try {
        // Fetching data from public Free Fire API
        const response = await axios.get(`https://freefireapi.com.br/api/search_id?id=${uid}`);
        
        if (response.data && response.data.nickname) {
            return res.json({
                status: "success",
                uid: uid,
                name: response.data.nickname,
                region: response.data.region || "Unknown",
                level: response.data.level || "N/A"
            });
        } else {
            return res.json({ status: "error", message: "Player nickname not found!" });
        }

    } catch (error) {
        // Backup logic using alternative public server if the first one fails
        try {
            const backupResponse = await axios.get(`https://api.garena.tools/ff/player/${uid}`);
            if (backupResponse.data && backupResponse.data.name) {
                return res.json({
                    status: "success",
                    uid: uid,
                    name: backupResponse.data.name,
                    region: backupResponse.data.region || "Unknown"
                });
            } else {
                return res.json({ status: "error", message: "Server is busy. Please try again later!" });
            }
        } catch (backupError) {
            return res.json({ status: "error", message: "Server is busy. Please try again later!" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

