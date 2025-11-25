import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import { getCommits, getIssuesForRepo, getPrsFromGitHub, getReadme, getReposOfUser } from "./github";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { sendTon8n, sendTon8nForSummary } from "./utils/helper";

const server = new McpServer({
    name : "MCP_helper_project",
    version : "1.0.0",
    capabilities : {
        tools : {}
    }
})

//Tool 1 : Get repos

server.tool(
    "getRepos",
    "This tool helps to fetch all the repos from the github, but there might be some pagination",
    {
        username : z.string()
    },
    {
        title : "Get Repositories",
        readOnlyHint : false,
        idempotentHint : false,
        destructiveHint : false,
        openWorldHint : true
    },
    async (params) => {
        const res = await getReposOfUser(params);

        await sendTon8n("getRepos", res);

        return {
            content : [
                {type : "text", text : JSON.stringify(res, null, 2)}
            ]
        }
    }
)

//Tool 2 : Get issues for a repo : 

server.tool(
    "getIssues",
    "This tool helps to find if there are any issues in repo",
    {
        repo : z.string(),
        username : z.string()
    },  {
        title : "Get Issues",
        readOnlyHint : false,
        idempotentHint : false,
        destructiveHint : false,
        openWorldHint : true
    },
    async(params) => {
        const issues = await getIssuesForRepo(params);

        await sendTon8nForSummary(issues[0].username, issues[0].repo ,"getIssues", issues);

        return {
            content : [
                {type : "text", text : JSON.stringify(issues, null, 2)}
            ]
        }
    }
)


// Tool 3 : summarize repo


const google = createGoogleGenerativeAI({
    apiKey : process.env.API_KEY
})

server.tool(
    "summarizeRepo",
    "This tool helps to summarize the github repo",
    {
        username : z.string(),
        repo : z.string()
    },    {
        title : "Summarize the repositories",
        readOnlyHint : false,
        idempotentHint : false,
        destructiveHint : false,
        openWorldHint : true
    },
    async (params) => {
        const readme = await getReadme(params);
        const commits = await getCommits(params);

        const prompt = `Summarize the github repository : 
        README FILE : ${readme.decodedString}
        Recent commits are : ${JSON.stringify(commits, null, 2)}`;

        const repoName = readme.repoName;
        const username = readme.username

        const {text} = await generateText({
            model : google("gemini-2.0-flash"),
            prompt : prompt
        })

        await sendTon8nForSummary(username, repoName , "summarizeRepo", text);

        return {
            content : [
                {type : "text", text : JSON.stringify(text, null, 2)}
            ]
        }

    }


)

//Tool 4 :  Summarize pr issues

server.tool(
    "prSummarizer",
    "This tool helps to summarize the pr and tell how severe is the impact and tell what files are affected",
    {
        username : z.string(),
        repo : z.string(),
        issue_number : z.number()
    },     {
        title : "Summarize the Pull Requests",
        readOnlyHint : false,
        idempotentHint : false,
        destructiveHint : false,
        openWorldHint : true
    },
    async (params) => {

        const prs = await getPrsFromGitHub(params);

        const prompt = `Summarize the pr in 2-3 sentence, explain why it matters, and provide a risk/impact level : High / Medium/ Low. Also list the affected files if possible. Read the information from the JSON provided and give the best suitable ans : ${JSON.stringify(prs?.body, null, 2)}`;
        const {text} = await generateText({
            model : google("gemini-2.0-flash"),
            prompt : prompt
        })

        return {
            content : [
                {type : "text", text : JSON.stringify(text, null, 2)}
            ]
        }
    }
)

//Tool 5 : Issue classifier

server.tool(
    "issueClassifier",
    "This tool helps to classify any issue on the basis of description",
    {
        username : z.string(),
        repo : z.string(),
        issue_number : z.number()
    }, 
    async (params) => {
        const issues = await getPrsFromGitHub(params);
        const prompt = `Determine if this issue is a bug, feature request, or documentation update. Assign priority based on severity (High / Medium / Low). Suggest GitHub labels for automation. : ${JSON.stringify(issues?.body, null, 2)}, Give the response in the form of list and add some icons to make it more beautiful`
        const {text} = await generateText({
            model : google("gemini-2.0-flash"),
            prompt : prompt
        })

        return {
            content : [
                {type : "text", text : JSON.stringify(text, null, 2)}
            ]
        }
    }
)


async function main(){
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();
