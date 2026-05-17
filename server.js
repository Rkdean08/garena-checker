const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Home route message
app.get('/', (req, res) => {
    res.send('<h1>Free Fire Checker - Live API Running! 🚀</h1><p>Use: /api/player?uid=YOUR_UID</p>');
});

// Main Player Check Route
app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.json({ status: "error", message: "Please enter a valid UID!" });
    }

    // Official HL Gaming API payload credentials
    const payload = {
        sectionName: "AllData",
        PlayerUid: uid,
        region: "sg",
        useruid: "hYjtFVZjmBVF5un9XUgwylFAAPu2",
        api: "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"
    };

    try {
        // Sending request to HL Gaming API server
        const response = await axios.post('https://proapis.hlgamingofficial.com/main/games/freefire/account/api', payload);
        const data = response.data;

        // Checking if we successfully received the Account Info from the server
        if (data && data.result && data.result.AccountInfo) {
            
            // Extracting player details properly from the live response
            const playerName = data.result.AccountInfo.AccountName;
            const playerLevel = data.result.AccountInfo.AccountLevel;
            const playerRegion = data.result.AccountInfo.AccountRegion || "Singapore";

            return res.json({
                status: "success",
                uid: uid,
                name: playerName,
                level: playerLevel,
                region: playerRegion
            });

        } else {
            // Error response if UID is completely invalid or server has limits
            return res.json({ 
                status: "error", 
                message: data.result ? data.result.message : "Invalid UID or API key limit reached!" 
            });
        }

    } catch (error) {
        // Network connection error handling
        return res.json({ 
            status: "error", 
            message: "HL Gaming API server network error!",
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


