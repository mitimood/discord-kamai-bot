const log = require('../logger')
const client = require("./discordClient")
const dbs = require("./db")

client.on("ready",()=>{
    try {
        module.exports = Object.assign( module.exports, {client,})

        require("./slashCommands")
        
        require("./events")

        client.user.setPresence({ status: `idle` })
    for( let id_guild of client.guilds.cache.keys()){
        await client.guilds.cache.get(id_guild).members.fetch()
    }
    
    } catch (error) {
        log.error(error)
    }

})

module.exports = Object.assign( module.exports, log, dbs)
