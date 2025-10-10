import { mcp } from "../client";

export async function summarizePR(req : any, res : any){
    console.log("Summarize PR function called");
    try {
        const response = await mcp.callTool({
            name : "prSummarizer",
            arguments : {
                username : req.body.username,
                repo : req.body.repo,
                issue_number : req.body.issue_number
            }
        })

        if(response){
            return res.json({
                type : "PRSummarize",
                data : response,
                url : req.body.url
            })
        } else {
            return ({
                error : `Unable to call mcp tool`
            })
        }
    } catch (error) {
        return ({
            error : `Unable to call function summarize PR`
        })
    }
}

export async function issueClassifier(req : any, res : any){
    try {
        console.log(req.body.username);
        const response = await mcp.callTool({
            name : "issueClassifier",
            arguments : {
                username : req.body.username,
                repo : req.body.repo,
                issue_number : req.body.issue_number
            }
        })

        return res.json({
            type : "issueClassifier",
            data : response,
            url : req.body.url
        })
    } catch (error) {
        return res.json({
            error : error
        })
    }
}