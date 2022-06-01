import axios from 'axios';

//returns the dependency verion in the repo
const getRepoPackageVersion = async (owner, repo, packageName) => {
    try {
        let packageJson = await axios.get('https://raw.githubusercontent.com/'+ owner+'/'+repo+'/main/package.json')
        return new Promise((resolve)=>{
            //if it is present in dependencies
            if(packageJson.data.dependencies[packageName])
                resolve(packageJson.data.dependencies[packageName]);
            //else if it is a dev dependency
            else if(packageJson.data.devDependencies && packageJson.data.devDependencies[packageName])
                resolve(packageJson.data.devDependencies[packageName]);
            //else return null
            else
                resolve(null);
        });
    } catch (error) {
        console.error(error)
    }
}

const getLatestPackageVersion = async (packageName) => {
    try {
        let result = await axios.get('http://registry.npmjs.com/-/v1/search?text='+packageName+'&size=20')
        return new Promise((resolve)=>{
            resolve(result.data.objects[0].package.version);
        });
    } catch (error) {
        console.error(error)
    }
}

export {getRepoPackageVersion, getLatestPackageVersion};