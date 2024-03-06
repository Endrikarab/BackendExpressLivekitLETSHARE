import express from "express";
import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const createToken = async () => {
  console.log("API Key:", process.env.LIVEKIT_API_KEY);
  console.log("API Secret:", process.env.LIVEKIT_API_SECRET);

  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  const roomName = "quickstart-room";
  // identifier to be used for the participant.
  // it's available as LocalParticipant.identity with livekit-client SDK
  const participantName = "quickstart-username";

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
    const token = await createToken();
    res.send(token);
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
