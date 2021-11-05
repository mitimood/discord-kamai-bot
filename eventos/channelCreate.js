const { client } = require("..");
const config = require("../config");

/*
 Listen when a channel is created and update its permissions
*/

client.on("channelCreate", channel=>{
    if(channel.type == "text"){
        try {
            console.log("Canal de texto criado " + Date.UTC())

            await channel.updateOverwrite(config.roles.muted, {SEND_MESSAGES:false})

        } catch (error) {
            console.log(error)
        }
    }
    if(channel.type == "voice"){
        try {
            console.log("Canal de voz " + Date.UTC())

            await channel.updateOverwrite(config.roles.muted, {CONNECT:false})

        } catch (error) {
            console.log(error)

        }
    }   
})