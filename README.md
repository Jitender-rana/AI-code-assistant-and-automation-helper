# 🤖 AI-Powered GitHub Intelligence & Automation System

> *"Could this project **BE** any more automated?" — Chandler Bing (probably)*  

A full-fledged **AI-driven developer productivity assistant** that connects your GitHub repositories, analyzes their activity using **Gemini AI**, and automates everything from insights to Slack/Notion updates — all through **MCP** and **n8n**.

---

## 🚀 What This Project Does

This isn’t another “fetch repos” script.  
It’s a backend engine that *thinks* about your GitHub ecosystem.

### 🧩 Core Features

| Feature | Description |
|----------|--------------|
| 🧠 **Repo Summarization** | Reads README + commits → generates concise summaries & insights using Gemini AI |
| 🧾 **PR Summarizer** | Reviews pull requests, highlights impact, risk level, and affected files |
| 🪲 **Issue Classifier** | Automatically classifies issues as bug / feature / documentation and assigns priorities |
| 📊 **Get Repos / Issues** | Fetches public repos & issues of any GitHub user |
| ⚙️ **Automation Ready** | Sends results to Slack & Notion via n8n for workflow automation |

---

## 🧱 Architecture Overview

This project follows a clean **MCP Server–Client model** for modular AI integration.

```bash
MCP Server (AI Logic & Tools)
│
├── getRepos
├── getIssues
├── summarizeRepo
├── prSummarizer
└── issueClassifier
│
└──> n8n (Automation workflows)
     ├── Slack Notifications
     └── Notion Updates

MCP Client (Express API)
│
└──> Handles external calls to MCP tools
⚡ Tech Stack
Component	Technology
💬 AI Model	Google Gemini (via @ai-sdk/google)
⚙️ Automation	n8n
🧠 Protocol	Model Context Protocol (MCP)
🌐 Backend	Node.js + Express + TypeScript
🐙 Source Data	GitHub REST API
🪄 Formatting	AI-generated summaries & classifications
☁️ Integrations	Slack + Notion

🧩 Tools Defined in MCP Server
Tool	Description
getRepos	Fetches repositories of a user
getIssues	Retrieves issues from a repository
summarizeRepo	AI summary of README + commits
prSummarizer	Analyzes pull request impact & files
issueClassifier	Classifies issues + assigns priority

🔄 Automation with n8n
The system sends outputs to n8n workflows which handle:

📨 Slack alerts for PR summaries & high-priority issues

🗒️ Notion entries for repo summaries or weekly updates

🔔 Real-time multi-repo monitoring

Check out the included JSON workflow:
N8n_workflow_for_mcp_server.json

🧠 Example AI Outputs
🧾 PR Summary
json
Copy code
{
  "summary": "Refactors user authentication for better token management.",
  "impact": "Medium",
  "affected_files": ["auth.js", "userController.js"]
}
🪲 Issue Classification
json
Copy code
{
  "type": "bug",
  "priority": "High",
  "suggested_labels": ["bug", "urgent"]
}
🚨 Why This Project Matters
Developers waste time parsing PRs and issues. This tool reads, classifies, and alerts — automatically.

Cuts review time by summarizing PRs & repos

Improves team coordination through automated updates

Provides cross-repo insights across multiple projects

Demonstrates AI integration + system automation in action

Works without a UI, because who doesn’t love a mysterious backend wizard?

🧭 Setup & Run Locally
1️⃣ Clone the repo
bash
Copy code
git clone https://github.com/<your-username>/AI-GitHub-Intelligence.git
cd AI-GitHub-Intelligence
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Build and run the MCP server
bash
Copy code
npm run build
node build/server.js
4️⃣ Start the MCP client
bash
Copy code
node build/client.js
5️⃣ Trigger a test
bash
Copy code
POST http://localhost:5679/getTools/summarizePR
{
  "username": "octocat",
  "repo": "Hello-World",
  "issue_number": 1
}
💬 Future Plans
🧩 Repo health scoring system

📈 Cross-repo analytics dashboard (optional)

🧠 AI suggestions for documentation improvement

🔐 OAuth-based GitHub integration

🚀 Cloud deployment on Railway + Docker

🧑‍💻 Author
Sagar [@github.com/<your-handle>]

“Built it, tested it, automated it — all without touching the mouse too much.”

🏷️ Hashtags
#AI #Automation #GitHub #DevTools #n8n #ModelContextProtocol #GeminiAI #BackendEngineering #DeveloperTools

⭐ Show Some Love
If this project made you go “huh, that’s actually smart”,
