"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizePR = summarizePR;
const client_1 = require("../client");
async function summarizePR(req, res) {
    console.log("Summarize PR function called");
    try {
        const response = await client_1.mcp.callTool({
            name: "prSummarizer",
            arguments: {
                username: req.body.username,
                repo: req.body.repo,
                issue_number: req.body.issue_number
            }
        });
        if (response) {
            return res.json({
                type: "PRSummarize",
                data: response,
                url: req.body.url
            });
        }
        else {
            return ({
                error: `Unable to call mcp tool`
            });
        }
    }
    catch (error) {
        return ({
            error: `Unable to call function summarize PR`
        });
    }
}
