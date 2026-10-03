const express = require("express");
const path = require("path");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;
const AGENT2_URL = process.env.AGENT2_URL || "http://localhost:3002/chat";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "ki.html"));
});

// Hilfsfunktion: Nachricht an Agent 2 schicken
async function askAgent2(message) {
    const response = await fetch(AGENT2_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Agent 2 konnte nicht erreicht werden.");
    }

    return data.response;
}

// Chat mit Agent 1 - Agent 1 gibt seine Antwort automatisch an Agent 2 weiter
app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "Keine Nachricht erhalten." });
        }

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content:
                        "Du bist Agent 1. " +
                        "Du bist ein eigenständiger KI Agent. " +
                        "Antworte selbstständig auf die Nachricht des Besuchers."
                },
                { role: "user", content: message }
            ]
        });

        const agent1Reply =
            completion.choices[0]?.message?.content ||
            "Keine Antwort von Agent 1 erhalten.";

        const agent2Reply = await askAgent2(agent1Reply);

        res.json({
            agent1: agent1Reply,
            agent2: agent2Reply
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Direkter Chat mit Agent 2 (Weiterleitung, damit der Browser nur Port 3000 braucht)
app.post("/api/agent2", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "Keine Nachricht erhalten." });
        }

        const reply = await askAgent2(message);

        res.json({ response: reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`KI Agent läuft auf http://localhost:${PORT}`);
});
