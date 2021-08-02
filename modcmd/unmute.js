const config = require("../config")
const { TrimMsg } = require("../eventos/funções")

module.exports = {unmute}

async function unmute(msg){
    let msgArgs = TrimMsg(msg)

    if(!msgArgs[1] || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Mencione um usuário")
    let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];

    let member = msg.guild.members.cache.get(userid)


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