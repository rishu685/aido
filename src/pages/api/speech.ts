import axios, { type AxiosRequestConfig } from "axios";
import type { NextApiHandler } from "next";
import { env } from "~/env.mjs";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  if (method === "GET") {
    try {
    const { text, gender } = req.query;
    const API_KEY = env.ELEVENLABS_API_KEY;
      
      if (!API_KEY) {
        return res.status(500).json({ error: "ElevenLabs API key not configured" });
      }
      
    const VOICE_ID =
      gender == "f" ? "EXAVITQu4vr4xnSDxMaL" : "GBv7mTt0atIp3Br8iCZE";

    // Set options for the API request.
    const options: AxiosRequestConfig = {
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        accept: "audio/mpeg", // Set the expected response type to audio/mpeg.
        "content-type": "application/json", // Set the content type to application/json.
        "xi-api-key": `${API_KEY}`, // Set the API key in the headers.
      },
      data: {
        text: text?.toString() ?? "Hello", // Pass in the inputText as the text to be converted to speech.
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
      },
      responseType: "arraybuffer", // Set the responseType to arraybuffer to receive binary data as response.
        timeout: 30000, // 30 second timeout
    };
      
    const speechDetails = await axios.request(options);
    const audio = speechDetails.data;

    res.setHeader("Content-Type", "audio/mpeg");
      return res.status(200).send(audio);
    } catch (error) {
      console.error("Speech API error:", error);
      return res.status(500).json({ 
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
export default handler;
