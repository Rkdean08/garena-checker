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

    if (!uid) {
        return res.json({ status: "error", message: "Please enter a valid UID!" });
    }

    try {
        // New Active Official Top-up API Logic
        const response = await axios.post('https://shop.garena.sg/api/shop/player_check', {
            app_id: 100067, // Free Fire Game App ID
            login_id: uid
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (response.data && response.data.player_name) {
            return res.json({
                status: "success",
                uid: uid,
                name: response.data.player_name,
                region: "Global"
            });
        } else {
            return res.json({ status: "error", message: "Player nickname not found or invalid UID!" });
        }

    } catch (error) {
        return res.json({ status: "error", message: "Server timeout. Please try again later!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
