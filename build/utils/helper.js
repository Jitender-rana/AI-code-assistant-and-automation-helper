"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTon8n = sendTon8n;
exports.sendTon8nForSummary = sendTon8nForSummary;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function sendTon8n(toolName, payload) {
    try {
        const n8nWebHookUrl = process.env.N8N_URL || `http://localhost:5678/webhook-test/github-mcp`;
        console.log(n8nWebHookUrl);
        const res = await axios_1.default.post("http://localhost:5678/webhook-test/github-mcp", {
            tool: toolName,
            data: payload,
            timestamp: new Date().toISOString()
        });
        if (res) {
            console.log(`DATA from ${toolName} sent successfully`);
        }
        else {
            console.log("Whattttttttt");
        }
    }
    catch (error) {
        console.error(`Unable to send data to n8n : ${error}`);
    }
}
// export async function sendTon8n(toolName : string, payload : any)  {
//     const n8nWebHookUrl = process.env.N8N_URL || `http://host.docker.internal/webhook/github-mcp`;
//     try {
//         await axios.post(n8nWebHookUrl,{
//             tool : toolName,
//             data : payload,
//             timestamp : new Date().toISOString()
//         });
//         console.log(`DATA from ${toolName} sent successfully`);
//     } catch (error) {
//         console.error(`Unable to send data to n8n`);
//     }
// }
async function sendTon8nForSummary(username, repoName, toolName, payload) {
    const n8nWebHookUrl = process.env.N8N_URL || `http://localhost:5678/webhook-test/github-mcp`;
    try {
        await axios_1.default.post(n8nWebHookUrl, {
            username: username,
            repoName: repoName,
            tool: toolName,
            data: payload,
            timestamp: new Date().toISOString()
        });
        console.log(`DATA from ${toolName} sent successfully`);
    }
    catch (error) {
        console.error(`Unable to send data to n8n`);
    }
}
