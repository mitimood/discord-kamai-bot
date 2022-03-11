const log = require('../logger')
const client = require("./discordClient")
const dbs = require("./db")

client.on("ready",()=>{
    try {
        module.exports = Object.assign( module.exports, {client,})

        require("./slashCommands")
        
        require("./events")
    
    } catch (error) {
        log.error(error)
    }

})

module.exports = Object.assign( module.exports, log, dbs)
