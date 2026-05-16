const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.get('/', (req, res) => { res.send('Garena UID Checker Live! 🚀'); });
app.get('/check', async (req, res) => {
    const uid = req.query.uid;
    if (!uid) return res.status(400).json({ error: 'UID required' });
    try {
        const response = await axios.post('https://shop.garena.sg/api/shop/pc/validate_player_id', {
            app_id: 100067, player_id: parseInt(uid)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://shop.garena.sg', 'Referer': 'https://shop.garena.sg/'
            }, timeout: 10000
        });
        if (response.data && response.data.nickname) return res.json({ name: response.data.nickname });
        else return res.json({ error: 'Player Not Found' });
    } catch (error) { return res.status(500).json({ error: 'Garena connection failed' }); }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
