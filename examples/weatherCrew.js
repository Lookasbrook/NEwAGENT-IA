require('dotenv').config({ path: require('path').join(__dirname, '.env')})
const {Tool, Agent, Task } = require('../core');
const { weatherTool, lmStudioTool } = require('../tools');

const CITY = 'Paris';
const VERBOSE = true;

//AGENTS
const weathfetcher = new Agent('weathfetcher', [weatherTool]);
const weatherAnalyst = new Agent('weatherAnalyst', [lmStudioTool],
    
);

