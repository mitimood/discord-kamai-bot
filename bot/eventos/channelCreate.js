const { client } = require("..");
const config = require("../config");

/*
 Listen when a channel is created and update its permissions
*/

client.on("channelCreate", (channel)=>{
    if(channel.type == "text"){
        channel.updateOverwrite(config.roles.muted, {SEND_MESSAGES:false})
    }
    if(channel.type == "voice"){
        channel.updateOverwrite(config.roles.muted, {CONNECT:false})
    }   
})