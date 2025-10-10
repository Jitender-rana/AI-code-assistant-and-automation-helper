"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReposOfUser = getReposOfUser;
exports.getIssuesForRepo = getIssuesForRepo;
exports.getReadme = getReadme;
exports.getCommits = getCommits;
exports.getPrsFromGitHub = getPrsFromGitHub;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function getReposOfUser(username) {
    const res = await axios_1.default.get(`https://api.github.com/users/${username.username}/repos`);
    if (res.status === 404) {
        return `The username is not valid`;
    }
    else {
        return res.data.map((r) => ({
            name: r.name,
            description: r.description,
            star: r.stargazers_count,
            lastcommit: r.lastCommit,
            langugae: r.language
        }));
    }
}
async function getIssuesForRepo(params) {
    const res = await axios_1.default.get(`https://api.github.com/repos/${params.username}/${params.repo}/issues`, {
        params: {
            state: "open"
        }
    });
    return res.data.map((issue) => ({
        title: issue.title,
        url: issue.url,
        labels: issue.labels.map((l) => l.name),
        createdAt: issue.created_at,
        assignee: issue.assignee?.login || null,
        repo: params.repo,
        username: params.username
    }));
}
async function getReadme(repoInfo) {
    const res = await axios_1.default.get(`http://api.github.com/repos/${repoInfo.username}/${repoInfo.repo}/readme`);
    const decodedString = Buffer.from(res.data.content, 'base64').toString('utf-8');
    return {
        decodedString: decodedString,
        repoName: repoInfo.repo,
        username: repoInfo.username
    };
}
async function getCommits(repoInfo) {
    try {
        const res = await axios_1.default.get(`http://api.github.com/repos/${repoInfo.username}/${repoInfo.repo}/commits`);
        if (!res) {
            console.log("Not able to fetch the data the from the api");
            return;
        }
        else {
            res.data.map((commit) => {
                console.log(commit.commit.committer.name);
                console.log(commit.commit.committer.email);
                console.log(commit.commit.committer.date);
                console.log(commit.commit.message);
            });
            return res.data.map((commit) => {
                name: commit.commit.committer.name;
                email: commit.commit.committer.email;
                date: commit.commit.committer.date;
                message: commit.commit.message;
            });
        }
    }
    catch (error) {
    }
}
async function getPrsFromGitHub(params) {
    try {
        const res = await axios_1.default.get(`https://api.github.com/repos/${params.username}/${params.repo}/issues/${params.issue_number}`);
        if (!res) {
            console.log("Unable to fetch data");
        }
        else {
            return ({
                body: res.data
            });
        }
    }
    catch (error) {
    }
}
// getStaleRepo({username : "sagar-admane", thresholdDays : 2}, 2)
getReposOfUser({ username: "sagar-admane" });
