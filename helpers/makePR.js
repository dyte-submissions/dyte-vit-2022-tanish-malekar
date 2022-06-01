import { Octokit } from "@octokit/core";
import  { Octokit as RestOctokit }  from "@octokit/rest";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import randomstring from 'randomstring';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const MyOctokit = Octokit.plugin(createPullRequest);
const TOKEN = process.env.ACCESS_TOKEN;

const octokit = new MyOctokit({
  auth: TOKEN,
});

const restOctokit = new RestOctokit({
    auth: TOKEN,
});

//Makes a PR to update the dependency and returns the link to the PR 
async function makePR(owner, repo, packageName, repoPackageVersion, specifiedPackageVersion){
    return new Promise(async (resolve) => { 
        
        //get the default branch name
        let rep = await restOctokit.rest.repos.get({
            owner: owner,
            repo:repo,
        })
        let defaultBranch = rep.data.default_branch;

        //create a pull request by forking the repo, making changes, commiting those changes and finally creating a PR. 
        await octokit.createPullRequest({
            owner: owner,
            repo: repo,
            title: `chore: updates ${packageName} to ${specifiedPackageVersion}`,
            body: `Updates the version of ${packageName} from ${repoPackageVersion} to ${specifiedPackageVersion}`,
            base:"main",
            head: randomstring.generate({length: 10,charset: 'alphabetic'}), //use a new random branch 
            forceFork: false ,
            changes: [
                {
                files: {
                    //update package.json
                    "package.json": async function( exists, encoding, content ){
                        if (!exists) return null;
                        let result = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/package.json`)
                        let obj = result.data
                        if(obj.dependencies[packageName])
                            obj.dependencies[packageName] = "^" + specifiedPackageVersion;
                        else if(obj.devDependencies[packageName])
                            obj.devDependencies[packageName] = "^" + specifiedPackageVersion;
                        return JSON.stringify(obj, null, 2) + "\n";
                    },
                    //update package-lock.json
                    "package-lock.json": async function( exists, encoding, content ){
                        if (!exists) return null;
                        let result = await axios.get(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/package-lock.json`)
                        let obj = result.data
                        if(obj.packages[""].dependencies[packageName])
                            obj.packages[""].dependencies[packageName] = "^" + specifiedPackageVersion;
                        else if(obj.packages[""].devDependencies[packageName])
                            obj.packages[""].devDependencies[packageName] = "^" + specifiedPackageVersion;
                        return JSON.stringify(obj, null, 2) + "\n";
                },
                },
                
                commit:`chore: updates ${packageName} to ${specifiedPackageVersion}`,
                },
            ],
        })
        .then((pr) => resolve(pr.data["_links"].html.href));
    });
}

export default makePR;