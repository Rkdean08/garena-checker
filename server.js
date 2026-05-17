const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS பிழையைத் தடுக்க Response Headers சேர்க்கிறோம் தம்பி!
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Free Fire Checker - Live API Running! 🚀</h1><p>Use: /api/player?uid=YOUR_UID</p>');
});

// Main Player Check Route
app.get('/api/player', async (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        return res.json({ status: "error", message: "Please enter a valid UID!" });
    }

    // 🎯 HL Gaming மெயின் சர்வருக்கான துல்லியமான பேராமீட்டர்கள் தம்பி!
    const payload = {
        "endpoint": "AllData",
        "PlayerUid": uid.trim(),
        "region": "S6",                            // 'sg'க்கு பதிலாக 'S6' (சிங்கப்பூர் சர்வர் குறியீடு)
        "userid": "hYjtFVZjmBVF5un9XUgwylFAAPu2",   // உங்களுடைய Dev ID
        "api": "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"      // உங்களுடைய Secret API Key
    };

    try {
        // 🔥 எடிட் செய்யப்பட்டது: 'Content-Type:' க்கு பதிலாக 'Content-Type' எனச் சரியாக மாற்றப்பட்டுள்ளது தம்பி!
        const response = await axios.post('https://proapis.hlgamingofficial.com/main/games/freefire/account/api', payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = response.data;

        // சர்வரிடமிருந்து வரும் ரெஸ்பான்ஸை துல்லியமாகச் செக் செய்கிறோம் தம்பி!
        if (data && data.result && data.result.AccountInfo && data.result.AccountInfo.AccountName) {
            return res.json({
                status: "success",
                uid: uid,
                name: data.result.AccountInfo.AccountName,
                level: data.result.AccountInfo.AccountLevel || "N/A",
                region: data.result.region || "S6"
            });
        } 
        else if (data && data.raw_response && data.raw_response.result && data.raw_response.result.AccountInfo) {
            return res.json({
                status: "success",
                uid: uid,
                name: data.raw_response.result.AccountInfo.AccountName,
                level: data.raw_response.result.AccountInfo.AccountLevel || "N/A",
                region: "S6"
            });
        }
        else {
            return res.json({
                status: "error",
                message: "Player Not Found on HL Server",
                raw_response: data 
            });
        }

    } catch (error) {
        let hlErrorDetails = error.message;
        if (error.response && error.response.data) {
            hlErrorDetails = error.response.data;
        }
        
        return res.json({
            status: "error",
            message: "HL Gaming API server returned an error!",
            details: hlErrorDetails
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
