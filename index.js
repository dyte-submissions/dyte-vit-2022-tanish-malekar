#! /usr/bin/env node
import {program}  from 'commander';
import checkDependancies from './actions/checkDependencies.js';
import updateToSpecifiedVersion from './actions/updateToSpecifiedVersion.js';
import updateToLatestVersion from './actions/updateToLatestVersion.js';

program
.argument('<CSVFilePath>')
.argument('<packageName>')
.option('-i') //option -i compares the dependency version with the specified version
.option('-update') //option -update creates PR for updating the dependency to the specified version 
.option('-updatelatest') //option -updatelatest creates PR for updating the dependency to the latest version available
.action((CSVFilePath, packageName, options, command)=>{
    let specifiedPackageVersion = packageName.substring(packageName.lastIndexOf('@')+1);
    packageName = packageName.substring(0, packageName.lastIndexOf('@'));
    if(options.Updatelatest){
        updateToLatestVersion(CSVFilePath, packageName);
    }
    else if(options.Update){
        updateToSpecifiedVersion(CSVFilePath, packageName, specifiedPackageVersion);
    }
    else if(options.i){
        checkDependancies(CSVFilePath, packageName, specifiedPackageVersion);
    }else{
        //do nothing
    }
})

program.parse()