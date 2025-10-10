import axios from "axios";
import env from "dotenv"

env.config();


export async function getReposOfUser(username : {
    username : string
}) {
    const res = await axios.get(`https://api.github.com/users/${username.username}/repos`);
    if(res.status === 404){
        return `The username is not valid`;
    } else {
        return res.data.map((r : any) => ({
            name : r.name,
            description : r.description,
            star : r.stargazers_count,
            lastcommit : r.lastCommit,
            langugae : r.language
        }))
    }
}

export async function getIssuesForRepo(params : {
    repo : string,
    username : string
}) {
    const res = await axios.get(`https://api.github.com/repos/${params.username}/${params.repo}/issues`, {
        params : {
            state : "open"
        }
    });

    return res.data.map((issue : any) => ({
        title : issue.title,
        url : issue.url,
        labels : issue.labels.map((l : any) => l.name),
        createdAt : issue.created_at,
        assignee : issue.assignee?.login || null,
        repo : params.repo,
        username : params.username
    }))
}

export async function getReadme(repoInfo : {
    username : string,
    repo : string
}) {
    const res = await axios.get(`http://api.github.com/repos/${repoInfo.username}/${repoInfo.repo}/readme`);
    const decodedString = Buffer.from(res.data.content, 'base64').toString('utf-8');
    return {
        decodedString : decodedString,
        repoName : repoInfo.repo,
        username : repoInfo.username
    }
}

export async function getCommits(repoInfo : {
    username : string,
    repo : string
}) {
    try {
        const res = await axios.get(`http://api.github.com/repos/${repoInfo.username}/${repoInfo.repo}/commits`);
        if(!res) {
            console.log("Not able to fetch the data the from the api");
            return;
        } else {
            
                res.data.map((commit : any) => {
                    console.log(commit.commit.committer.name);
                    console.log(commit.commit.committer.email);
                    console.log(commit.commit.committer.date);
                    console.log(commit.commit.message);
                    
                })

            return res.data.map((commit : any) => {
                name : commit.commit.committer.name;
                email : commit.commit.committer.email;
                date : commit.commit.committer.date;
                message : commit.commit.message;
            })
        }
    } catch (error) {
        
    }
}


export async function getPrsFromGitHub(params : {
    username : string,
    repo : string,
    issue_number : number
}) {
    try {
        const res = await axios.get(`https://api.github.com/repos/${params.username}/${params.repo}/issues/${params.issue_number}`);
        if(!res){
            console.log("Unable to fetch data");
        } else {
            return ({
                body : res.data
            })
        }
    } catch (error) {
        
    }
}

// getStaleRepo({username : "sagar-admane", thresholdDays : 2}, 2)
getReposOfUser({username:"sagar-admane"})