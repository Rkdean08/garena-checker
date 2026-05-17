export default async function handler(req, res) {

  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "UID missing"
    });
  }

  try {

    const response = await fetch(
      "https://proapis.hlgamingofficial.com/main/games/freefire/account/api",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          sectionName: "AllData",
          PlayerUid: uid,
          region: "sg",
          useruid: "hYjtFVZjmBVF5un9XUgwylFAAPu2",
          api: "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"
        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      success: true,
      uid: uid,
      player_name: data.result.AccountInfo.AccountName,
      level: data.result.AccountInfo.AccountLevel,
      likes: data.result.AccountInfo.AccountLikes
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      error: err.message
    });

  }
}
