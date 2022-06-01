import fs from 'fs';
import Papa from 'papaparse';

//returns data from the CSV File in JSON format
async function getDataFromCSV(CSVFilePath){
    const csvFile = fs.readFileSync(CSVFilePath)
    const csvData = csvFile.toString()  
    return new Promise(resolve => {
      Papa.parse(csvData, {
        header: true,
        transformHeader: h => h.trim().replace(/"/g, ''),
        skipEmptyLines: 'greedy',
        complete: results => {
          resolve(results.data);
        }
      });
    });
}

export default getDataFromCSV;