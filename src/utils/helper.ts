import axios from "axios"
import env from "dotenv"

env.config();

export async function sendTon8n(toolName : string, payload : any)  {
    try {
        const n8nWebHookUrl = process.env.N8N_URL || `http://localhost:5678/webhook-test/github-mcp`;

        console.log(n8nWebHookUrl);

        const res = await axios.post("http://localhost:5678/webhook-test/github-mcp",{
            tool : toolName,
            data : payload,
            timestamp : new Date().toISOString()
        });

        if(res){
            console.log(`DATA from ${toolName} sent successfully`);
        } else {
            console.log("Whattttttttt");
        }

    } catch (error) {
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

export async function sendTon8nForSummary(username : string ,repoName : string ,toolName : string, payload : any)  {
    const n8nWebHookUrl = process.env.N8N_URL || `http://localhost:5678/webhook-test/github-mcp`;
    try {
        await axios.post(n8nWebHookUrl,{
            username : username,
            repoName : repoName,
            tool : toolName,
            data : payload,
            timestamp : new Date().toISOString()
        });

        console.log(`DATA from ${toolName} sent successfully`);
    } catch (error) {
        console.error(`Unable to send data to n8n`);
    }
}