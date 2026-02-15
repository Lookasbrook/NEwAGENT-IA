require('dotenv') .config();
const fs = require('fs').promises;
const { Tool } = require('./MyCrewDemo');
const { json } = require('body-parser');
const { application } = require('express');
const LM_API_URL = process.env. LM_API_URL;
const LM_MODEL = process.env.LM_MODEL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!LM_API_URL || !LM_MODEL)
{
    throw new Error( 'Variables LM_API_URL et LM_Model requises dans .env')
}

const lmStudioTool = new Tool('lmStudio' , async (input, systemPrompt = null) => {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system' , content: systemPrompt });
    messages.push({ role: 'user', content: input });
    console.log(`[LM STUDIO] Prompt sent: ${input}`);
    const res = await fetch(LM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ model: LM_MODEL, messages })
    });
    const data = await res.json();
    const result = data.choices?. [0].message?.content || '';
    console.log(`[LM STUDIO] Response: ${result}`);
    return result;
})

const fetchTool = new Tool('fetch', async (url) => {
    console.log(`[FETCH] Calling API: ${url}`);
            const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        })
        const result = await response.text();
        console.log(`[FETCH] Response: ${result.substring(0, 200)}...`);
        return result.replace(/<script[\s\S]*?<\/script>/gi, "")
             .replace(/<style[\s\S]*?<\/style>/gi, "")
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();

    });
    const fileWriteTool = new Tool('Writefile', async ({filename, content}) => {
        console.log(`[WRITE FILE] Writing to: ${filename}`);
        console.log(`[WRITE FILE] Content: ${content.substring(0, 100)}...`);

        await fs.writeFile(filename, content, 'utf8');
        const result = `File written: ${filename}`;
        console.log(`[WRITE FILE] Result: ${result}`);
        return result;
        
    })

    const weatherTool = new Tool ('weather', async (city) => {
        const url = `http:api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIcomponent(city)}&aqi=no`;
        console.log(`[WEATHER] Calling API for city: ${city}`);
        console.log(`[WEATHER] API URL: ${url}`);
        const response = await fetch(url);
        const data = await response.json();

        console.log(`[WEATHER] API Response: ${JSON.stringify(data, null, 2)}`);

        if (data.error) {
            const erroMsg = `Weather API Error: ${data.error.message}` ;
            console.log(`[WEATHER] Error: ${erroMsg}`);
            throw new Error(erroMsg);
        }

        const result = `Météo a ${data.location.name}: ${data.current.temp_c} )°C,${data.current.condition.texte}. Ressenti: ${data.current.feelslike_c}0°C,Humidité: ${data.current.humidity}%`;
        console.log(`[WEATHER] Formatted Result: ${result}`);
        return result;

        }
)


module.exports = { lmStudioTool, fetchTool, fileWriteTool, weatherTool };