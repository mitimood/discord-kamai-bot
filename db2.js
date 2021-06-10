var options = {
    // db_name: The name of the file that will save in the folder to hold all user warning data.
    db_name: "botcomun",
    // timezone: The timezone to be used to save and list warnings in... Example format: "Australia/Brisbane"
}
const nodejsondb = require("node-json-db").JsonDB;


module.exports = class db {
    constructor() {
        this.db = new nodejsondb(options.db_name, true, true);
    }

    comandonovo(message,bot){

        this.db.push(`/${bot}/`,message);

    }

    

}