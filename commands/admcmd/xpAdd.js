const { client } = require("../../index");
const config = require("../../config");
const { TrimMsg } = require("../../utils/auxiliarFunctions");
const { add_voice_xp, add_chat_xp } = require("../../mongodb");
const logger = require("../../utils/logger");

/*
    say command, will reply a message content inside the especified channel

say (channel id) (message content)
*/
module.exports={
    name: "xpadd",
    aliases: [],
    description: "Adiciona xp",

    async execute (message){

        try {
            var msgArgs = TrimMsg(message)

            if(msgArgs[1] == "voice"){
                await add_voice_xp([msgArgs[2]], parseInt(msgArgs[3]))
                await message.channel.send(`DEI PARA ${msgArgs[2]} ${msgArgs[3]}XP VOICE POINTS`)

            }else if( msgArgs[1] == "chat"){
                await add_chat_xp(msgArgs[2], parseInt(msgArgs[3]))
                await message.channel.send(`DEI PARA ${msgArgs[2]} ${msgArgs[3]}XP CHAT POINTS`)
                
            }else{
                await message.channel.send("xpadd chat/voice id points")
            }
        } catch (error) {
            logger.error(error)   
        }
    }
}