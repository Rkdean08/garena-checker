export default async function handler(req, res) {

  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({
      error: "UID missing"
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
          sectionName: "AccountBasicInfo",
          PlayerUid: uid,
          region: "sg",
          useruid: "hYjtFVZjmBVF5un9XUgwylFAAPu2",
          api: "uEEXadfmtyyzF9GKHjmDLvjoEM7mSX"
        })
      }
    );

    const data = await response.text();

    res.status(200).send(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
