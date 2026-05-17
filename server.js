const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/player", async (req, res) => {

    try {

        const uid = req.query.uid;

        if (!uid) {
            return res.status(400).json({
                success: false,
                message: "UID Missing"
            });
        }

        const payload = {
            sectionName: "AllData",
            PlayerUid: String(uid),
            region: "S6",
            useruid: "hYjtFVZjmBVF5un9XUgwylFAAPu2",
            api: "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"
        };

        const response = await axios.post(
            "https://proapis.hlgamingofficial.com/main/games/freefire/account/api",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const apiData = response.data;

        console.log(apiData);

        const playerName =
            apiData?.AccountInfo?.AccountName ||
            apiData?.nickname ||
            apiData?.name ||
            null;

        if (!playerName) {
            return res.json({
                success: false,
                message: "Player Not Found",
                raw: apiData
            });
        }

        return res.json({
            success: true,
            player_name: playerName,
            raw: apiData
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "API Error",
            error: error.response?.data || error.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
