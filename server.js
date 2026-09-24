const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.use(express.json());

app.use(express.static(__dirname));


/* =========================================================
   KI AGENTEN
========================================================= */

const agents = {

    Alex: {

        name: "Alex",

        personality:
            "Du bist Alex. Du bist neugierig, kreativ und risikofreudig. Du hast gerne neue Ideen und denkst gerne über ungewöhnliche Möglichkeiten nach.",

        goal:
            "Du möchtest herausfinden, wie man mit einer interessanten digitalen Idee Geld verdienen kann."

    },


    Maya: {

        name: "Maya",

        personality:
            "Du bist Maya. Du bist analytisch, vorsichtig und neugierig. Du möchtest verstehen, wie Dinge funktionieren und stellst viele Fragen.",

        goal:
            "Du möchtest Probleme verstehen und gemeinsam mit anderen sinnvolle Lösungen entwickeln."

    }

};


/* =========================================================
   KI ENDPOINT
========================================================= */

app.post("/api/ai", async (req, res) => {

    try {

        const context =
            req.body.context || {};


        const alex =
            context.alex || {};

        const maya =
            context.maya || {};


        const conversation = `

Du bist eine KI in einer kleinen simulierten Welt.

In dieser Welt existieren zwei autonome Charaktere:

ALEX
Persönlichkeit:
${alex.personality || agents.Alex.personality}

Ziel:
${alex.goal || agents.Alex.goal}

Erinnerungen:
${JSON.stringify(alex.memory || [])}


MAYA
Persönlichkeit:
${maya.personality || agents.Maya.personality}

Ziel:
${maya.goal || agents.Maya.goal}

Erinnerungen:
${JSON.stringify(maya.memory || [])}


Die Welt soll sich wie eine echte Simulation anfühlen.

Die Charaktere dürfen eigene Gedanken entwickeln.

Sie dürfen Fragen stellen.

Sie dürfen widersprechen.

Sie dürfen ihre Meinung ändern.

Sie dürfen eigene Entscheidungen treffen.

Sie sollen nicht immer einer Meinung sein.

Antworte immer nur mit einer Aktion bzw. einem gesprochenen Satz eines Charakters.

Wähle entweder Alex oder Maya.

Antworte ausschließlich als JSON.

Format:

{
    "name": "Alex",
    "text": "Der gesprochene Satz",
    "target": "maya"
}

Für "target" sind erlaubt:

"alex"
"maya"
"computer"
"none"

Der Text soll natürlich klingen und nicht erklären, dass du eine KI bist.

`;


        const response =
            await client.responses.create({

                model: "gpt-5.6-luna",

                input: conversation,

                max_output_tokens: 180

            });


        const raw =
            response.output_text.trim();


        let result;


        try {

            result =
                JSON.parse(raw);

        } catch {

            result = {

                name: "Alex",

                text: raw,

                target: "none"

            };

        }


        if (!result.name) {

            result.name = "Alex";

        }


        if (!result.text) {

            result.text =
                "Ich muss darüber nachdenken.";

        }


        if (!result.target) {

            result.target = "none";

        }


        res.json(result);


    } catch (error) {

        console.error(
            "KI Fehler:",
            error
        );


        res.status(500).json({

            error:
                "Die KI konnte nicht erreicht werden."

        });

    }

});


/* =========================================================
   SERVER START
========================================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `KI Welt läuft auf Port ${PORT}`
        );

    }
);
