<!DOCTYPE html>

<html lang="de">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>KI Agenten System</title>


<style>

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    background:
        radial-gradient(
            circle at top,
            #182238 0%,
            #090d16 45%,
            #05070b 100%
        );

    color: #e8edf7;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    min-height: 100vh;
}


.container {

    width: min(1200px, 94%);

    margin: 40px auto;

}


h1 {

    margin: 0;

    font-size: 30px;

    font-weight: 600;

}


.subtitle {

    margin-top: 8px;

    color: #8995aa;

}


.panel {

    margin-top: 25px;

    padding: 22px;

    border: 1px solid #273247;

    border-radius: 14px;

    background: rgba(13, 18, 29, 0.88);

    box-shadow:
        0 20px 60px rgba(0,0,0,0.35);

}


label {

    display: block;

    margin-bottom: 8px;

    color: #aab5c8;

    font-size: 14px;

}


input,
textarea,
select {

    width: 100%;

    padding: 13px 14px;

    margin-bottom: 18px;

    border: 1px solid #303b51;

    border-radius: 9px;

    outline: none;

    background: #090e18;

    color: #eef3fb;

    font-size: 15px;

}


textarea {

    min-height: 110px;

    resize: vertical;

}


input:focus,
textarea:focus,
select:focus {

    border-color: #607aa8;

}


.agents {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 20px;

}


.agent {

    padding: 18px;

    border: 1px solid #29354a;

    border-radius: 12px;

    background: #0b101a;

}


.agent h2 {

    margin-top: 0;

    font-size: 19px;

    font-weight: 500;

}


button {

    width: 100%;

    padding: 14px;

    border: none;

    border-radius: 9px;

    background: #e8edf7;

    color: #070a10;

    font-size: 16px;

    font-weight: 600;

    cursor: pointer;

}


button:hover {

    background: #ffffff;

}


button:disabled {

    opacity: 0.5;

    cursor: wait;

}


.status {

    margin-top: 15px;

    color: #8995aa;

    font-size: 14px;

}


.results {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 20px;

    margin-top: 25px;

}


.result {

    min-height: 260px;

    padding: 20px;

    border: 1px solid #29354a;

    border-radius: 12px;

    background: #080d15;

}


.result h3 {

    margin-top: 0;

    font-size: 17px;

}


.output {

    white-space: pre-wrap;

    line-height: 1.6;

    color: #cbd4e3;

}


@media (max-width: 800px) {

    .agents,
    .results {

        grid-template-columns: 1fr;

    }

}

</style>

</head>


<body>


<div class="container">


    <h1>KI Agenten System</h1>

    <div class="subtitle">
        Zwei KI Agenten kommunizieren über deinen Vermittlungsserver.
    </div>


    <div class="panel">


        <label for="topic">
            Thema
        </label>

        <textarea
            id="topic"
            placeholder="Gib ein Thema ein..."
        ></textarea>


        <div class="agents">


            <!-- AGENT 1 -->

            <div class="agent">

                <h2>Agent 1</h2>

                <label for="agent1Name">
                    Name
                </label>

                <input
                    id="agent1Name"
                    value="Analyst"
                >


                <label for="agent1System">
                    Aufgabe
                </label>

                <textarea
                    id="agent1System"
                >Analysiere das Thema gründlich. Entwickle Argumente, Zusammenhänge und mögliche Lösungen.</textarea>

            </div>


            <!-- AGENT 2 -->

            <div class="agent">

                <h2>Agent 2</h2>

                <label for="agent2Name">
                    Name
                </label>

                <input
                    id="agent2Name"
                    value="Kritiker"
                >


                <label for="agent2System">
                    Aufgabe
                </label>

                <textarea
                    id="agent2System"
                >Prüfe die Analyse des ersten Agenten. Suche nach Fehlern, ergänze fehlende Aspekte und entwickle eine eigene Antwort.</textarea>

            </div>


        </div>


        <label for="model">
            Modell
        </label>

        <select id="model">

            <option value="gpt-5.6-luna">
                GPT 5.6 Luna
            </option>

            <option value="gpt-5.6-terra">
                GPT 5.6 Terra
            </option>

            <option value="gpt-5.6-sol">
                GPT 5.6 Sol
            </option>

        </select>


        <button id="startButton">
            AGENTEN KOMMUNIZIEREN LASSEN
        </button>


        <div
            class="status"
            id="status"
        >
            Bereit.
        </div>


    </div>


    <!-- ERGEBNISSE -->

    <div class="results">


        <div class="result">

            <h3 id="agent1Title">
                Agent 1
            </h3>

            <div
                class="output"
                id="agent1Output"
            >
                Noch keine Antwort.
            </div>

        </div>


        <div class="result">

            <h3 id="agent2Title">
                Agent 2
            </h3>

            <div
                class="output"
                id="agent2Output"
            >
                Noch keine Antwort.
            </div>

        </div>


    </div>


</div>


<script>

const startButton =
    document.getElementById("startButton");


const status =
    document.getElementById("status");


const topic =
    document.getElementById("topic");


const agent1Name =
    document.getElementById("agent1Name");


const agent1System =
    document.getElementById("agent1System");


const agent2Name =
    document.getElementById("agent2Name");


const agent2System =
    document.getElementById("agent2System");


const model =
    document.getElementById("model");


const agent1Title =
    document.getElementById("agent1Title");


const agent2Title =
    document.getElementById("agent2Title");


const agent1Output =
    document.getElementById("agent1Output");


const agent2Output =
    document.getElementById("agent2Output");



startButton.addEventListener(
    "click",
    startConversation
);



async function startConversation() {

    const topicText =
        topic.value.trim();


    if (!topicText) {

        status.textContent =
            "Bitte zuerst ein Thema eingeben.";

        return;
    }


    startButton.disabled = true;


    status.textContent =
        "Agent 1 denkt...";


    agent1Output.textContent =
        "Antwort wird erzeugt...";


    agent2Output.textContent =
        "Warte auf Agent 1...";


    try {


        const response =
            await fetch(
                "/api/agents/talk",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        topic:
                            topicText,

                        model:
                            model.value,

                        agent1: {

                            name:
                                agent1Name.value,

                            system:
                                agent1System.value

                        },

                        agent2: {

                            name:
                                agent2Name.value,

                            system:
                                agent2System.value

                        }

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Serverfehler."
            );

        }


        agent1Title.textContent =
            data.agent1.name;


        agent2Title.textContent =
            data.agent2.name;


        agent1Output.textContent =
            data.agent1.response;


        status.textContent =
            "Agent 1 hat geantwortet. Agent 2 antwortet...";


        agent2Output.textContent =
            data.agent2.response;


        status.textContent =
            "Kommunikation abgeschlossen.";


    } catch (error) {


        console.error(error);


        status.textContent =
            "Fehler: " +
            error.message;


        agent1Output.textContent =
            "Keine Antwort.";


        agent2Output.textContent =
            "Keine Antwort.";

    }


    startButton.disabled = false;

}

</script>


</body>

</html>
