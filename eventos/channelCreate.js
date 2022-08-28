const { ChannelType } = require("discord.js");
const { client } = require("..");
const config = require("../config");
const logger = require("../utils/logger");

/*
 Listen when a channel is created and update its permissions
*/

client.on("channelCreate", async channel=>{
    if(channel.type == ChannelType.GuildText){
        try {
            console.log("Canal de texto criado " + new Date())

            await channel.permissionOverwrites.create(config.roles.muted, {SendMessages:false})

        } catch (error) {
            logger.error(error)
        }
    }
    if(channel.type == ChannelType.GuildVoice){
        try {
            console.log("Canal de voz " + new Date())

            await channel.permissionOverwrites.create(config.roles.muted, {Connect:false})

        } catch (error) {
            logger.error(error)

        }
    }   
})