var options = {
    // db_name: The name of the file that will save in the folder to hold all user warning data.
    db_name: "selfbotinic",
    // timezone: The timezone to be used to save and list warnings in... Example format: "Australia/Brisbane"
    timezone: "Australia/Brisbane"
}
const nodejsondb = require("node-json-db").JsonDB;
const moment = require("moment-timezone");


module.exports = class db {
    constructor() {
        this.db = new nodejsondb(options.db_name, true, true);
    }


    getnick(){
        return new Promise((resolve,reject) =>{
            try{
        resolve(this.db.getData(`/avatar`))}catch(err) { // If no nicks return empty
            resolve([]);
        }
        })
    }

    addnick(nick) { // Returns: Number (The users new total warning point value)
        return new Promise((resolve, reject) => {
            try {
                this.db.push(`/avatar/${nick}`);
            }
            catch (err) {
                reject(err);
            }
        });
    }

}