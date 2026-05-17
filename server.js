const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

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
        sectionName: "AllData",                    // Fixed to documentation standard
        PlayerUid: uid,
        region: "sg",                             // Singapore server region
        useruid: "hYjtFVZjmBVF5un9XUgwylFAAPu2",   // Your Official Dev ID
        api: "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"     // Your Official Secret API Key
    };

    try {
        // Sending request to HL Gaming API server
        const response = await axios.post('https://proapis.hlgamingofficial.com/main/games/freefire/account/api', payload);
        const data = response.data;

        // Validating the response data based on documentation
        if (data && data.result && data.result.valid === true) {
            
            // Extracting player details correctly
            const playerName = data.result.AccountInfo.AccountName;
            const playerLevel = data.result.AccountInfo.AccountLevel;

            return res.json({
                status: "success",
                uid: uid,
                name: playerName,
                level: playerLevel,
                region: data.result.region || "Singapore"
            });

        } else {
            // Returns the exact error coming directly from HL Gaming server to see what is wrong
            return res.json({ 
                status: "error", 
                message: "API error response received",
                raw_response: data // This will show us the real error behind the scene!
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
