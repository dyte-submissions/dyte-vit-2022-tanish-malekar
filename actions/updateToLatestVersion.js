import compareVersions from 'compare-versions';
import getDataFromCSV from '../helpers/getDataFromCSV.js';
import {getRepoPackageVersion, getLatestPackageVersion} from '../helpers/getPackageVersion.js';
import printTable from '../helpers/printTable.js';
import makePR from '../helpers/makePR.js';

async function updateToLatestVersion(CSVFilePath, packageName){
    let data = await getDataFromCSV(CSVFilePath);
    //iterating over each of the rows in csv file
    for(var i=0; i<data.length; i++){
        let owner = data[i].repo.split('/')[3];
        let repo = data[i].repo.split('/')[4];

        //gets the dependency version in the repo
        let repoPackageVersion = await getRepoPackageVersion(owner, repo, packageName);

        //gets the latest dependency version
        let latestPackageVersion = await getLatestPackageVersion(owner, repo, packageName)

        //if the given dependency is not present in the repo, mark it as "not present"
        if(!repoPackageVersion){
            data[i].version = "not present";
            data[i].version_satisfied = "-";
            continue;
        }

        //remove ^ from version
        if(repoPackageVersion.charAt(0)=='^'){ repoPackageVersion =  repoPackageVersion.substring(1)}
        data[i].version = repoPackageVersion;
        
        //comapare the verions and make PR if required
        if(compareVersions(repoPackageVersion, latestPackageVersion)==0){
            data[i].version_satisfied = true;
        }else{
            data[i].version_satisfied = false;
            let PRLink = await makePR(owner, repo, packageName, repoPackageVersion, latestPackageVersion);
            data[i].update_pr = PRLink;
        }; 
    }

    //print table to the terminal
    printTable(data, true);
}

export default updateToLatestVersion;