import express from "express";
import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const createToken = async (roomName, participantName) => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      ttl: "120m",
    }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};

app.get("/getToken", async (req, res) => {
  try {
    const { roomName, participantName } = req.query;

    if (!roomName || !participantName) {
      return res
        .status(400)
        .send("Both roomName and participantName are required.");
    }

    const token = await createToken(roomName, participantName);
    res.send(token);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
