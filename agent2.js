const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.AGENT2_PORT || 3002;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        agent: "Agent 2",
        status: "online"
    });
});

app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "Keine Nachricht erhalten" });
        }

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content:
                        "Du bist Agent 2. Du bist ein eigenständiger KI Agent. " +
                        "Du reagierst auf die tatsächliche Nachricht von Agent 1. " +
                        "Antworte eigenständig und inhaltlich auf das Gesagte. " +
                        "Wiederhole nicht einfach die Nachricht. " +
                        "Es gibt keine vorgegebene Gesprächsschleife."
                },
                { role: "user", content: message }
            ]
        });

        const response =
            completion.choices[0]?.message?.content ||
            "Keine Antwort erhalten.";

        res.json({
            agent: "Agent 2",
            response: response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Agent 2 läuft auf Port ${PORT}`);
});
