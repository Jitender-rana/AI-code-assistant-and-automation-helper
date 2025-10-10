import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import express from "express"
import cors from "cors"
import { sendTon8n } from "./utils/helper";
import router from "./routes/route";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/getTools", router);

export const mcp = new Client({
    name : "Mcp_client",
    version : "1.0.0"
}, {
    capabilities : {
        sampling : {}
    }
})

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.post("/getTool", async(req, res) => {
        main();
        console.log(req.body);
        const response = await handleTools(req.body);
        return res.json({
            response
        });
})

/*
Testing
*/



async function handleTools(body : any){
    if(body.action==="created"){
        const res = await handleGetAllRepos(body);
        return res;
    }
}

async function handleGetAllRepos(body : any){
    try {
        const res = await mcp.callTool({
            name : "summarizeRepo",
            arguments : {
                username : body.repository.owner.login,
                repo : body.repository.name
            }
        })

        if(res){

            if((res.content as [{text : string}])[0].text==="Request failed with status code 404"){
                return {
                    tool : "summarizeRepo",
                    data : "The repository is empty"
                }
            }
            // const response = await sendTon8n("getRepos", res);
            return {
                tool : "summarizeRepo",
                data : [res]
            }
        } else {
            console.log("Error in calling the tool")
        }
    } catch (error) {
        console.error(error);
    }
}

const transport = new StdioClientTransport({
    command : "node",
    args : ["build/server.js"],
    stderr : "ignore"
})

export async function main(){
    await mcp.connect(transport);
    console.log(`MCP Client connected to server`)
}

main();


app.listen(5679, ()=>{
    console.log("CLient started");
})