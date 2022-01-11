const mongoDB = require(`../../mongodb`);
const config = require(`../../config`);
const { TrimMsg, punishments}= require(`../../utils/funções`)

/*
    adds a warn to a specific user adding some points to it

   0       1     2     3
comando pessoa ponto motivo
*/
module.exports={
    name: "warn",
    aliases: [],
    description: "adiciona uma advertência ao membro",

    async execute (msg){
        try {
            return await msg.reply("Comando desabilitado, use <#903238831417991228>")

        } catch (error) {
            
        }finally{
            return
        }
        let msgArgs = TrimMsg(msg)

        if(!msgArgs[1] || !msgArgs[2] || !msgArgs[2].match(/[0-9]/g) || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Utilize: warn user pontos motivo")

        let userid = msg.mentions.repliedUser ? ( Array.from(msg.mentions.members)[1] ? Array.from(msg.mentions.members)[1].user.id : msgArgs[1].match(/[0-9]+/)[0] ) : (msg.mentions.members.first() ) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];
        let reason = (msgArgs[3]) ? msg.content.substring(msgArgs.slice(0, 3).join(" ").length + 1) : "Motivo não informado";

        await mongoDB.warn_add(userid, msg.author.id,msgArgs[2], reason)
        
        let warns = await mongoDB.warn_list(userid);
        let mod_log = msg.guild.channels.cache.get(config.channels.modlog)
        
        msg.channel.send({embeds:[{
            description: `**Membro advertido**\n<@${userid}> (Advertência total: ${warns["points"]})\n`+ "Motivo:`"+ reason + "`"+ `por ${msgArgs[2]} advertência`,
            color:config.color.sucess
        }]})
        
        mod_log.send({embeds:[{
            description: `**Nova advertencia**\n<@${userid}> (Advertência: ${warns["points"]}) foi advertido por <@${msg.author.id}>\n`+ "Motivo:`"+ reason + "`"+ ` por ${msgArgs[2]} advertência`,
            color:config.color.orange,
            footer:{ text: `id: ${userid}` }
        }]})
        punishments(userid, warns["points"], msg.guild, msg.author)
    }
}