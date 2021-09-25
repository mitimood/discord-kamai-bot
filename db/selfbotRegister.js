var options = {
    // db_name: The name of the file that will save in the folder to hold all user selfbot.
    db_name: "db/storage/selfbotRegister",
}
const nodejsondb = require("node-json-db").JsonDB;

module.exports = class db {
    constructor() {
        this.db = new nodejsondb(options.db_name, true, true);
    }

    selfbotAdd(timeRegistred = String, avatarHash = String, id = String, usertag = String, accountCreated = Int16Array, joinedServer = null){
        try{
            this.db.push(`./selfBot/${timeRegistred}[]`,{"id":id,"avatarHash": avatarHash, "usertag": usertag, "accountCreated":accountCreated, "joinedServer": joinedServer}, true)
        }catch(err){
            console.log(err)
        }
    }

    async SelfbotListTime(time){
            try{
                const data = await this.db.getObject(`./selfBot/`)
                let archive = ""
                for(let selfRegTime in data){
                    if(selfRegTime > time){
                        
                        for( let selfUser of data[selfRegTime]){
                            archive += `\n${selfUser.id}`
                        }
                        for( let selfUser of data[selfRegTime]){
                            archive += `\n${selfUser.avatarHash}`
                        }
                        for( let selfUser of data[selfRegTime]){
                            archive += `\n${selfUser.usertag}`
                        }
                        for( let selfUser of data[selfRegTime]){
                            archive += `\n${selfUser.accountCreated}`
                        }
                        for( let selfUser of data[selfRegTime]){
                            archive += `\n${selfUser.joinedServer}`
                        }
                    }                    
                }
                return archive

            }catch(err){
                console.log(err)
            } 
    }
}
