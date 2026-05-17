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
      region: "SG",
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

    const data = response.data;

    return res.json({
      success: true,
      data
    });

  } catch (error) {

    console.log(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
