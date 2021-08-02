const config = require("../config")
const { TrimMsg } = require("../eventos/funções")

module.exports = {unmute}

async function unmute(msg){
    let msgArgs = TrimMsg(msg)
    let member = msg.guild.members.cache.get(msgArgs[1])
    
    if (member){
        if (member.roles.cache.has(config.roles.muted)){
            member.roles.remove(config.roles.muted)
            if(member.voice){
                member.voice.setMute(false)
            }
            return msg.channel.send(msg.author.tag+` O membro ${member.user.tag} foi mutado` )
        }else{
            return msg.channel.send(msg.author.tag+" O membro não esta mutado")
        }
    }else{
        return msg.channel.send(msg.author.tag+" O membro não esta no servidor")
    }
}