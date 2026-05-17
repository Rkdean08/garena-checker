const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/player", async (req, res) => {

    const uid = req.query.uid;

    if (!uid) {
        return res.json({
            success: false,
            error: "UID Required"
        });
    }

    try {

        const response = await axios.post(
            "https://proapis.hlgamingofficial.com/main/games/freefire/account/api",
            {
                endpoint: "AllData",
                PlayerUid: uid,
                region: "S6",
                userid: "hYjtFVZjmBVF5un9XUgwylFAAPu2",
                api: "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const data = response.data;

        if (
            data.result &&
            data.result.AccountInfo &&
            data.result.AccountInfo.AccountName
        ) {

            return res.json({
                success: true,
                name: data.result.AccountInfo.AccountName
            });

        } else {

            return res.json({
                success: false,
                error: "Player Not Found"
            });
        }

    } catch (error) {

        return res.json({
            success: false,
            error: "Server Error"
        });
    }
});

module.exports = app;
