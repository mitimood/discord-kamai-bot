const { TrimMsg } = require("../../funções/funções");
const { add_voice_xp, add_chat_xp } = require("../../mongodb");

/*
    say command, will reply a message content inside the especified channel

say (channel id) (message content)
*/
module.exports={
    name: "xpadd",
    aliases: [],
    description: "Adiciona xp",

    async execute (message){

    
    var msgArgs = TrimMsg(message)

    if(msgArgs[1] == "voice"){
        add_voice_xp(msgArgs[2], msgArgs[3])
        message.channel.send(`DEI PARA ${msgArgs[2]} ${msgArgs[3]}XP VOICE POINTS`)

    }else if( msgArgs[1] == "chat"){
        add_chat_xp(msgArgs[2], msgArgs[3])
        message.channel.send(`DEI PARA ${msgArgs[2]} ${msgArgs[3]}XP CHAT POINTS`)
    }else{
        message.channel.send("xpadd chat/voice id points")
    }
    
    }
}