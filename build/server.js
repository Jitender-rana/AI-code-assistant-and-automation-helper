"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const github_1 = require("./github");
const google_1 = require("@ai-sdk/google");
const ai_1 = require("ai");
const helper_1 = require("./utils/helper");
const server = new mcp_js_1.McpServer({
    name: "MCP_helper_project",
    version: "1.0.0",
    capabilities: {
        tools: {}
    }
});
//Tool 1 : Get repos
server.tool("getRepos", "This tool helps to fetch all the repos from the github, but there might be some pagination", {
    username: zod_1.z.string()
}, {
    title: "Get Repositories",
    readOnlyHint: false,
    idempotentHint: false,
    destructiveHint: false,
    openWorldHint: true
}, async (params) => {
    const res = await (0, github_1.getReposOfUser)(params);
    await (0, helper_1.sendTon8n)("getRepos", res);
    return {
        content: [
            { type: "text", text: JSON.stringify(res, null, 2) }
        ]
    };
});
//Tool 2 : Get issues for a repo : 
server.tool("getIssues", "This tool helps to find if there are any issues in repo", {
    repo: zod_1.z.string(),
    username: zod_1.z.string()
}, async (params) => {
    const issues = await (0, github_1.getIssuesForRepo)(params);
    await (0, helper_1.sendTon8nForSummary)(issues[0].username, issues[0].repo, "getIssues", issues);
    return {
        content: [
            { type: "text", text: JSON.stringify(issues, null, 2) }
        ]
    };
});
// Tool 3 : summarize repo
const google = (0, google_1.createGoogleGenerativeAI)({
    apiKey: process.env.API_KEY
});
server.tool("summarizeRepo", "This tool helps to summarize the github repo", {
    username: zod_1.z.string(),
    repo: zod_1.z.string()
}, async (params) => {
    const readme = await (0, github_1.getReadme)(params);
    const commits = await (0, github_1.getCommits)(params);
    const prompt = `Summarize the github repository : 
        README FILE : ${readme.decodedString}
        Recent commits are : ${JSON.stringify(commits, null, 2)}`;
    const repoName = readme.repoName;
    const username = readme.username;
    const { text } = await (0, ai_1.generateText)({
        model: google("gemini-2.0-flash"),
        prompt: prompt
    });
    await (0, helper_1.sendTon8nForSummary)(username, repoName, "summarizeRepo", text);
    return {
        content: [
            { type: "text", text: JSON.stringify(text, null, 2) }
        ]
    };
});
//Tool 4 :  Summarize pr issues
server.tool("prSummarizer", "This tool helps to summarize the pr and tell how severe is the impact and tell what files are affected", {
    username: zod_1.z.string(),
    repo: zod_1.z.string(),
    issue_number: zod_1.z.number()
}, async (params) => {
    const prs = await (0, github_1.getPrsFromGitHub)(params);
    const prompt = `Summarize the pr in 2-3 sentence, explain why it matters, and provide a risk/impact level : High / Medium/ Low. Also list the affected files if possible. Read the information from the JSON provided and give the best suitable ans : ${JSON.stringify(prs?.body, null, 2)}`;
    const { text } = await (0, ai_1.generateText)({
        model: google("gemini-2.0-flash"),
        prompt: prompt
    });
    return {
        content: [
            { type: "text", text: JSON.stringify(text, null, 2) }
        ]
    };
});
//Tool 5 : Issue classifier
server.tool("issueClassifier", "This tool helps to classify any issue on the basis of description", {
    username: zod_1.z.string(),
    repo: zod_1.z.string(),
    issue_number: zod_1.z.number()
}, async (params) => {
    const issues = await (0, github_1.getPrsFromGitHub)(params);
    const prompt = `Determine if this issue is a bug, feature request, or documentation update. Assign priority based on severity (High / Medium / Low). Suggest GitHub labels for automation. : ${JSON.stringify(issues?.body, null, 2)}`;
    const { text } = await (0, ai_1.generateText)({
        model: google("gemini-2.0-flash"),
        prompt: prompt
    });
    return {
        content: [
            { type: "text", text: JSON.stringify(text, null, 2) }
        ]
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main();
