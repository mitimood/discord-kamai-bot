const { client } = require("..");
const config = require("../config");
const logger = require("../utils/logger");

/*
 Listen when a channel is created and update its permissions
*/

client.on("channelCreate", async channel=>{
    if(channel.type == "text"){
        try {
            console.log("Canal de texto criado " + new Date())

            await channel.updateOverwrite(config.roles.muted, {SEND_MESSAGES:false})

        } catch (error) {
            logger.error(error)
        }
    }
    if(channel.type == "voice"){
        try {
            console.log("Canal de voz " + new Date())

            await channel.updateOverwrite(config.roles.muted, {CONNECT:false})

        } catch (error) {
            logger.error(error)

        }
    }   
})