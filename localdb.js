var options = {
    // db_name: The name of the file that will save in the folder to hold all user warning data.
    db_name: "LocalDb",
    // timezone: The timezone to be used to save and list warnings in... Example format: "Australia/Brisbane"
}
const nodejsondb = require("node-json-db").JsonDB;

module.exports = class db {
    constructor() {
        this.db = new nodejsondb(options.db_name, true, true);
    }

    set_channel_state(channel_id, boolean_state){
        try{
            this.db.push(`/channels/${channel_id}`,{"state": boolean_state}, true)
        }catch(err){
            console.log(err)
        }
    }

    get_channel(channel_id){
        try{
            if(this.db.exists(`/channels/${channel_id}`)){
            let channel = this.db.getObject(`/channels/${channel_id}`)
            return channel
            }else{
                return false
            }
        }catch(err){
            console.log(err)
        }
    }
    
    }      