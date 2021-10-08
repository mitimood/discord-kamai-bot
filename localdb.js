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

    set_bot_state(bot_id, boolean_state){
        try{
            this.db.push(`/bot/${bot_id}`,{"state": boolean_state}, true)
            
        }catch(err){
            console.log(err)
        }
    }

    get_bot(){
        try{
            if(this.db.exists(`/bot`)){
                const bot = this.db.getData(`/bot/${bot_id}`)
                console.log(bot)
            
            }else{
                return 1
            }
        }catch(err){
            console.log(err)
        }
    }

    savechan(chan,userid){
        try {
            this.db.push(`/users/${userid}/channel`,chan)
        } catch (error) {
            console.log(error)
        }

    }

    chandelete(userid){
        try {
            this.db.delete(`/users/${userid}`)
        } catch (error) {
            console.log(error)
        }
    }

    async userVoiceExist(userid){
        try {
            return this.db.exists(`/users/${userid}`)

        } catch (error) {
            console.log(error)
        }
    }

    async channelget(userid){
        try{
            return this.db.getData(`/users/${userid}/channel/`)
        }catch(err){
            console.error(err)
        }
    }
    async verifyactivity(userid){
        try{
            return this.db.getData(`/users/${userid}/activity/`)
        }catch(err){
            console.error(err)
        }
        
    }
    async attactivity(userid,state){
        try{
            this.db.push(`/users/${userid}/activity/`,state)
        }catch(err){
            console.log(err)
        }
    }
    }      