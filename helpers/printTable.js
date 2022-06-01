import Table from 'cli-table';

//prints table to the terminal of the given json object (data)
function printTable(data, ifUpdate){
    var table = new Table({
        head: ifUpdate?["name", "repo", "version", "version_satisfied", "update_pr"]:["name", "repo", "version", "version_satisfied"],
    });

    data.forEach(element => {
        table.push(Object.values(element)) 
    });

    console.log(table.toString());
}

export default printTable;