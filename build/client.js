"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcp = void 0;
exports.main = main;
const client_1 = require("@modelcontextprotocol/sdk/client");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./routes/route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/getTools", route_1.default);
exports.mcp = new client_1.Client({
    name: "Mcp_client",
    version: "1.0.0"
}, {
    capabilities: {
        sampling: {}
    }
});
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.post("/getTool", async (req, res) => {
    main();
    console.log(req.body);
    const response = await handleTools(req.body);
    return res.json({
        response
    });
});
/*
Testing
*/
async function handleTools(body) {
    if (body.action === "created") {
        const res = await handleGetAllRepos(body);
        return res;
    }
}
async function handleGetAllRepos(body) {
    try {
        const res = await exports.mcp.callTool({
            name: "summarizeRepo",
            arguments: {
                username: body.repository.owner.login,
                repo: body.repository.name
            }
        });
        if (res) {
            if (res.content[0].text === "Request failed with status code 404") {
                return {
                    tool: "summarizeRepo",
                    data: "The repository is empty"
                };
            }
            // const response = await sendTon8n("getRepos", res);
            return {
                tool: "summarizeRepo",
                data: [res]
            };
        }
        else {
            console.log("Error in calling the tool");
        }
    }
    catch (error) {
        console.error(error);
    }
}
const transport = new stdio_js_1.StdioClientTransport({
    command: "node",
    args: ["build/server.js"],
    stderr: "ignore"
});
async function main() {
    await exports.mcp.connect(transport);
    console.log(`MCP Client connected to server`);
}
main();
app.listen(5679, () => {
    console.log("CLient started");
});
