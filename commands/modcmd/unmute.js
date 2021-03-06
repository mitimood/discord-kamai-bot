const config = require("../../config")
const { TrimMsg } = require("../../utils/auxiliarFunctions")
const logger = require("../../utils/logger")

module.exports={
    name: "unmute",
    aliases: [],
    description: "desmuta o membro previamente mutado",

    async execute(msg){
        try {
            let msgArgs = TrimMsg(msg)

            if(!msgArgs[1] || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Mencione um usuário")
            let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];
    
            let member = msg.guild.members.cache.get(userid)
    
    
            if (member){
                if (member.roles.cache.has(config.roles.muted)){
                    await member.roles.remove(config.roles.muted)
                    if(member.voice){
                        try{
                            await member.voice.setMute(false)
                        }catch{
    
                        }
                    }
                    return msg.channel.send(msg.author+` O membro ${member.user} foi desmutado` )
                }else{
                    return msg.channel.send(msg.author+" O membro não esta mutado")
                }
            }else{
                return msg.channel.send(msg.author+" O membro não esta no servidor")
            }
        } catch (error) {
            logger.error(error)
        }

    }
}