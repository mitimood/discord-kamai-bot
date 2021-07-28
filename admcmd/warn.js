// Warnable 2.0.0 - Command
const mongoDB = require(`../mongodb`);
const config = require(`../config`);
const { TrimMsg, punishments}= require(`../eventos/funções`)

module.exports = {warn}

/*
   0       1     2     3
comando pessoa ponto motivo
*/
async function warn(msg){
    let msgArgs = TrimMsg(msg)

    if(!msgArgs[1] || !msgArgs[2] || !msgArgs[2].match(/[0-9]/g) || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Utilize: warn user pontos motivo")


    let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];
    let reason = (msgArgs[3]) ? msg.content.substring(msgArgs.slice(0, 3).join(" ").length + 1) : "Motivo não informado";

    await mongoDB.warn_add(userid, msg.author.id,msgArgs[2], reason)
    let warns = await mongoDB.warn_list(userid);
    let mod_log = msg.guild.channels.cache.get(config.channels.modlog)
    msg.channel.send({embed:{
        description: `**Membro advertido**\n<@${userid}> (Advertência total: ${warns["points"]})\n`+ "Motivo:`"+ reason + "`"+ `por ${msgArgs[2]} advertência`,
        color:config.color.sucess
    }})
    mod_log.send({embed:{
        description: `**Nova advertencian**\n<@${userid}> (Advertência: ${warns["points"]}) foi advertido por <@${msg.author.id}>\n`+ "Motivo:`"+ reason + "`"+ `por ${msgArgs[2]} advertência`,
        color:config.color.sucess
    }})
    punishments(userid, warns["points"], msg.guild, msg.author)
    

}
    