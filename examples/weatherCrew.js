require('dotenv').config({ path: require('path').join(__dirname, '../.env')})
const {Tool, Agent, Task } = require('../MyCrewDemo');
const { weatherTool, lmStudioTool } = require('../tools');

const CITY = 'Paris';
const VERBOSE = true;

//AGENTS
const weatherFetcher = new Agent('weatherFetcher', [weatherTool]);
const weatherAnalyst = new Agent('weatherAnalyst', [lmStudioTool],
    "Tu es un analyste météo expert. Tu reçois des données brutes sur la météo d'une ville et tu dois les analyser pour fournir une synthèse claire et concise de la situation météorologique actuelle, ainsi que des recommandations si nécessaire. Voici les données brutes que tu as reçues:"
);

//TASKS
const tasks = [
    new Task(CITY, 'weather'), // 1. Récupérer les données météo
    new Task(
        "Analyse ces données météo et donne des conseils pratiques pour la journée : quels vêtement porter, activités recommandées ou déconseillées, précautions a prendre. Sois concis et utile.",
        'lmStudio'
    ) //2 Analyse IA
];

class Crew {
    constructor(agents = []) {
        this.agents = agents;
    }

    async run(tasks = []) {
        const results = [];
        let lastResult = null;
        for (let i = 0; i < tasks.length; i++) {
            const agent = this.agents[i % this.agents.length];
            const toolName = tasks[i].toolName;
            const percent = Math.round(((i + 1) / tasks.length) * 100);
            console.log(`\n[CREW] Task ${i + 1}/${tasks.length} (${percent}%) - Agent: ${agent.name}, Tool: ${toolName}`);

            //Injecte résultat précédent pour l'analyse IA
            if (toolName === 'lmStudio' && i > 0 && lastResult) {
                tasks[i].input = `${tasks[i].input}\n\nDonnées météo brutes : ${lastResult}`;
            }
            lastResult = await agent.perform(tasks[i]);
            if (VERBOSE) {
                console.log(`[CREW] Result of task ${i + 1}: ${lastResult}`);
            }
            results.push(lastResult);
        }
        console.log(`Analyse météo terminé pour la ville de ${CITY} !`);
        return results;
    }
}

// Utilisation de la Crew
const crew = new Crew([weatherFetcher, weatherAnalyst]);
crew.run(tasks).then(console.log).catch(console.error);
